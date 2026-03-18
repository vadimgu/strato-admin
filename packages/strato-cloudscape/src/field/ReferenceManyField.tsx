import React, { ReactNode } from 'react';
import { ReferenceManyFieldBase, type RaRecord, ResourceSchemaProvider } from '@strato-admin/core';
import { type FieldProps } from './types';

export interface ReferenceManyFieldProps<
  RecordType extends RaRecord = RaRecord,
  ReferenceRecordType extends RaRecord = RaRecord,
> extends FieldProps<RecordType> {
  children?: ReactNode;
  reference: string;
  target: string;
  filter?: any;
  sort?: { field: string; order: 'ASC' | 'DESC' };
  perPage?: number;
  page?: number;
  fieldSchema?: ReactNode;
  /**
   * Element to display during loading.
   */
  loading?: ReactNode;
  /**
   * Element to display if there's no data.
   */
  empty?: ReactNode;
  /**
   * Element to display if there's an error.
   */
  error?: ReactNode;
  /**
   * Element to display if the application is offline.
   */
  offline?: ReactNode;
  /**
   * Debounce time for filtering.
   */
  debounce?: number;
  /**
   * Whether to synchronize the list with the URL.
   * @default false
   */
  synchronizeWithLocation?: boolean;
}

/**
 * Render related records to the current one.
 *
 * @example
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Table title="Comments">
 *         <Table.Column source="id" />
 *         <Table.Column source="body" />
 *         <Table.Column source="created_at" />
 *     </Table>
 * </ReferenceManyField>
 */
export const ReferenceManyField = <
  RecordType extends RaRecord = RaRecord,
  ReferenceRecordType extends RaRecord = RaRecord,
>(
  props: ReferenceManyFieldProps<RecordType, ReferenceRecordType>
) => {
  const { children, reference, fieldSchema, ...rest } = props;

  return (
    <ReferenceManyFieldBase reference={reference} {...rest}>
      <ResourceSchemaProvider resource={reference} fieldSchema={fieldSchema}>
        {children}
      </ResourceSchemaProvider>
    </ReferenceManyFieldBase>
  );
};

export default ReferenceManyField;
