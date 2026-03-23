import { useState, useEffect } from 'react';
import {
  useResourceContext,
  useRecordContext,
  RaRecord,
  useCanAccess,
  useResourceDefinition,
} from '@strato-admin/ra-core';
import { useCreatePath } from './useCreatePath';

export interface UseGetPathForRecordOptions<RecordType extends RaRecord = RaRecord> {
  resource?: string;
  record?: RecordType;
  link?: string | boolean | ((record: RecordType, resource: string) => string | false | Promise<string | false>);
}

/**
 * Strato version of useGetPathForRecord that uses the Strato useCreatePath hook
 * to ensure that links generated for records follow the new routing scheme.
 */
export const useGetPathForRecord = <RecordType extends RaRecord = RaRecord>(
  options: UseGetPathForRecordOptions<RecordType> = {},
): string | false | undefined => {
  const { link } = options || {};
  const record = useRecordContext(options);
  const resource = useResourceContext(options);
  if (!resource) {
    throw new Error(
      'Cannot generate a link for a record without a resource. You must use useGetPathForRecord within a ResourceContextProvider, or pass a resource prop.',
    );
  }
  const resourceDefinition = useResourceDefinition(options);
  const createPath = useCreatePath();
  const [path, setPath] = useState<string | false>(
    link && typeof link !== 'function' && record != null
      ? createPath({
          resource,
          id: record.id,
          type: link as any,
        })
      : false,
  );

  const { canAccess: canAccessShow } = useCanAccess({
    action: 'show',
    resource,
    record,
    enabled: link == null && resourceDefinition.hasShow,
  });
  const { canAccess: canAccessEdit } = useCanAccess({
    action: 'edit',
    resource,
    record,
    enabled: link == null && resourceDefinition.hasEdit,
  });

  useEffect(() => {
    if (!record) return;

    if (link === false) {
      setPath(false);
      return;
    }

    if (link == null) {
      if (resourceDefinition.hasShow && canAccessShow) {
        setPath(
          createPath({
            resource,
            id: record.id,
            type: 'show',
          }),
        );
        return;
      }
      if (resourceDefinition.hasEdit && canAccessEdit) {
        setPath(
          createPath({
            resource,
            id: record.id,
            type: 'edit',
          }),
        );
        return;
      }
    }

    if (typeof link === 'function') {
      const linkResult = link(record, resource);
      if (linkResult instanceof Promise) {
        linkResult.then((resolvedPath) => setPath(resolvedPath));
        return;
      }
      setPath(
        linkResult
          ? createPath({
              resource,
              id: record.id,
              type: linkResult as any,
            })
          : false,
      );
      return;
    }

    if (link) {
      setPath(
        createPath({
          resource,
          id: record.id,
          type: link as any,
        }),
      );
    }
  }, [
    createPath,
    canAccessShow,
    canAccessEdit,
    link,
    record,
    resource,
    resourceDefinition.hasEdit,
    resourceDefinition.hasShow,
  ]);

  return path;
};
