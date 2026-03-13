import React, { type ReactNode } from 'react';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext, useLocale } from 'ra-core';
import RecordLink, { type RecordLinkType } from '../RecordLink';
import { useFieldContext } from './FieldContext';

export type NumberFieldProps<RecordType extends RaRecord = RaRecord> = Omit<BaseFieldProps<RecordType>, 'source'> & {
  source?: string;
  label?: ReactNode;
  emptyText?: ReactNode;
  options?: Intl.NumberFormatOptions;
  locales?: string | string[];
  link?: RecordLinkType;
};

const NumberField = <RecordType extends RaRecord = RaRecord>(props: NumberFieldProps<RecordType>) => {
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

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  const formattedValue = new Intl.NumberFormat(locales || currentLocale, options).format(numberValue);

  return (
    <RecordLink link={link}>{formattedValue}</RecordLink>
  );
};

export default NumberField;
