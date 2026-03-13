import React, { type ReactNode } from 'react';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext } from 'ra-core';
import RecordLink, { type RecordLinkType } from '../RecordLink';
import { useFieldContext } from './FieldContext';

export type TextFieldProps<RecordType extends RaRecord = RaRecord> = Omit<BaseFieldProps<RecordType>, 'source'> & {
  source?: string;
  label?: ReactNode;
  emptyText?: ReactNode;
  link?: RecordLinkType;
};

const TextField = <RecordType extends RaRecord = RaRecord>(props: TextFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, emptyText, link } = props;
  
  // if source is undefined, useFieldValue might complain or just return undefined. 
  // ra-core useFieldValue expects source to be a string normally, but lets pass it anyway.
  // Wait, if source is undefined, value will be undefined.
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <RecordLink link={link}>{hasValue ? String(value) : (emptyText ?? null)}</RecordLink>
  );
};

export default TextField;
