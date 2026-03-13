import React, { type ReactNode } from 'react';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext, useLocale } from 'ra-core';
import RecordLink, { type RecordLinkType } from '../RecordLink';
import { useFieldContext } from './FieldContext';

export type DateFieldProps<RecordType extends RaRecord = RaRecord> = Omit<BaseFieldProps<RecordType>, 'source'> & {
  source?: string;
  emptyText?: ReactNode;
  options?: Intl.DateTimeFormatOptions;
  locales?: string | string[];
  link?: RecordLinkType;
};

const DateField = <RecordType extends RaRecord = RaRecord>(props: DateFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, emptyText, options, locales, link } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const currentLocale = useLocale();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  const dateValue = value instanceof Date ? value : new Date(value);
  const formattedValue = new Intl.DateTimeFormat(locales || currentLocale, options).format(dateValue);

  return (
    <RecordLink link={link}>{formattedValue}</RecordLink>
  );
};

export default DateField;
