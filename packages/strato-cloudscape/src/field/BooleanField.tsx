import React from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { type BaseFieldProps, RaRecord, useFieldValue, useRecordContext } from 'ra-core';
import { useFieldContext } from './FieldContext';

export type BooleanFieldProps<RecordType extends RaRecord = RaRecord> = BaseFieldProps<RecordType> &
  Omit<BoxProps, 'children'> & {
    trueLabel?: string;
    falseLabel?: string;
    showLabel?: boolean;
  };

const BooleanField = <RecordType extends RaRecord = RaRecord>(props: BooleanFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, trueLabel, falseLabel, showLabel, ...boxProps } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as string, record });

  const isTrue = !!value;

  return (
    <Box {...boxProps} display="inline-block">
      <Icon name={isTrue ? 'check' : 'close'} variant={isTrue ? 'success' : 'error'} />
      {showLabel && <Box margin={{ left: 'xxs' }}>{isTrue ? (trueLabel ?? 'Yes') : (falseLabel ?? 'No')}</Box>}
    </Box>
  );
};

export default BooleanField;
