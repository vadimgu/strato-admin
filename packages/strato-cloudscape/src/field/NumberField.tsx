import { type RaRecord, useFieldValue, useRecordContext, useLocale } from 'strato-core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type NumberFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType> & {
  /**
   * Options for Intl.NumberFormat.
   */
  options?: Intl.NumberFormatOptions;
  /**
   * Locale(s) to use for formatting. Defaults to the current app locale.
   */
  locales?: string | string[];
};

const NumberField = <RecordType extends RaRecord = RaRecord>(props: NumberFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, options, locales, link } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const currentLocale = useLocale();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  const formattedValue = new Intl.NumberFormat(locales || currentLocale, options).format(numberValue);

  return <RecordLink link={link}>{formattedValue}</RecordLink>;
};

(NumberField as any).isNumberColumn = true;

export default NumberField;
