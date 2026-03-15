import { type ReactNode } from 'react';
import { ReferenceFieldBase, type RaRecord, useRecordContext, useResourceDefinition } from 'strato-core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type ReferenceFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType> & {
  /**
   * The resource name that this field refers to.
   */
  reference: string;
  /**
   * Optional custom representation of the related record. If not provided,
   * the recordRepresentation of the referenced resource will be used.
   */
  children?: ReactNode;
};

const ReferenceField = <RecordType extends RaRecord = RaRecord>(props: ReferenceFieldProps<RecordType>) => {
  const { source, reference, children, emptyText, record, link } = props;

  if (!source) {
    return null; // Or some fallback
  }

  return (
    <ReferenceFieldBase source={source} reference={reference} record={record} empty={<>{emptyText ?? null}</>}>
      <ReferenceFieldValue emptyText={emptyText} link={link} reference={reference}>
        {children}
      </ReferenceFieldValue>
    </ReferenceFieldBase>
  );
};

const ReferenceFieldValue = ({ children, emptyText, link, reference }: any) => {
  const record = useRecordContext();
  const { recordRepresentation } = useResourceDefinition();

  if (!record) {
    return <>{emptyText ?? null}</>;
  }

  if (children) {
    return (
      <RecordLink link={link} resource={reference}>
        {children}
      </RecordLink>
    );
  }

  let representation: ReactNode = '';
  if (typeof recordRepresentation === 'function') {
    representation = recordRepresentation(record);
  } else if (typeof recordRepresentation === 'string') {
    representation = record[recordRepresentation];
  } else {
    representation = record.id;
  }

  return (
    <RecordLink link={link} resource={reference}>
      {representation ? String(representation) : (emptyText ?? null)}
    </RecordLink>
  );
};

export default ReferenceField;
