import { type RaRecord, useFieldValue, useRecordContext } from '@strato-admin/ra-core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type TextFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType>;

const TextField = <RecordType extends RaRecord = RaRecord>(props: TextFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, link } = props;

  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const hasValue = value !== null && value !== undefined && value !== '';

  return <RecordLink link={link}>{hasValue ? String(value) : (emptyText ?? null)}</RecordLink>;
};

export default TextField;
