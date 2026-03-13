import React from 'react';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { type BaseFieldProps, RaRecord, useFieldValue, useRecordContext, useTranslate } from 'ra-core';
import { useFieldContext } from './FieldContext';

export type BooleanFieldProps<RecordType extends RaRecord = RaRecord> = Omit<BaseFieldProps<RecordType>, 'source'> & {
  source?: string;
  trueLabel?: string;
  falseLabel?: string;
  showLabel?: boolean;
};

const BooleanField = <RecordType extends RaRecord = RaRecord>(props: BooleanFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, trueLabel, falseLabel, showLabel = false } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const translate = useTranslate();

  const isTrue = !!value;

  if (isTrue) {
    return (
      <StatusIndicator type="success" colorOverride="green">
        {showLabel ? (trueLabel ?? translate('ra.boolean.true', { _: 'Yes' })) : null}
      </StatusIndicator>
    );
  }

  return (
    <StatusIndicator type="not-started">
      {showLabel ? (falseLabel ?? translate('ra.boolean.false', { _: 'No' })) : null}
    </StatusIndicator>
  );
};

export default BooleanField;
