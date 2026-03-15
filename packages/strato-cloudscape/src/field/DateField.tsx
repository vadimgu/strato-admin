import { type RaRecord, useFieldValue, useRecordContext, useLocale } from 'strato-core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type DateFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType> & {
  /**
   * Options for Intl.DateTimeFormat.
   */
  options?: Intl.DateTimeFormatOptions;
  /**
   * Locale(s) to use for formatting. Defaults to the current app locale.
   */
  locales?: string | string[];
};

const DateField = <RecordType extends RaRecord = RaRecord>(props: DateFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, options, locales, link } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const currentLocale = useLocale();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  const dateValue = value instanceof Date ? value : new Date(value);
  const formattedValue = new Intl.DateTimeFormat(locales || currentLocale, options).format(dateValue);

  return <RecordLink link={link}>{formattedValue}</RecordLink>;
};

export default DateField;
