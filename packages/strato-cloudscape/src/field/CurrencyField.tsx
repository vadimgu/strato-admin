import { type RaRecord, useFieldValue, useRecordContext, useLocale } from 'strato-core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type CurrencyFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType> & {
  /**
   * Options for Intl.NumberFormat.
   */
  options?: Intl.NumberFormatOptions;
  /**
   * Locale(s) to use for formatting. Defaults to the current app locale.
   */
  locales?: string | string[];
  /**
   * The currency to use in currency formatting.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#currency_2
   */
  currency: string;
};

const CurrencyField = <RecordType extends RaRecord = RaRecord>(props: CurrencyFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, options, locales, link, currency } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const currentLocale = useLocale();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    ...options,
  };
  const formattedValue = new Intl.NumberFormat(locales || currentLocale, formatOptions).format(numberValue);

  return <RecordLink link={link}>{formattedValue}</RecordLink>;
};

(CurrencyField as any).isNumberColumn = true;

export default CurrencyField;
