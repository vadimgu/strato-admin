import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext, useLocale } from 'ra-core';
import FieldLink, { type FieldLinkType } from './FieldLink';
import { useFieldContext } from './FieldContext';

export type NumberFieldProps<RecordType extends RaRecord = RaRecord> = BaseFieldProps<RecordType> &
  Omit<BoxProps, 'children'> & {
    label?: ReactNode;
    emptyText?: ReactNode;
    options?: Intl.NumberFormatOptions;
    locales?: string | string[];
    link?: FieldLinkType;
  };

const NumberField = <RecordType extends RaRecord = RaRecord>(props: NumberFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, emptyText, options, locales, link, ...boxProps } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as string, record });
  const currentLocale = useLocale();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <Box {...boxProps}>{emptyText ?? null}</Box>;
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  const formattedValue = new Intl.NumberFormat(locales || currentLocale, options).format(numberValue);

  return (
    <Box {...boxProps}>
      <FieldLink link={link}>{formattedValue}</FieldLink>
    </Box>
  );
};

export default NumberField;
