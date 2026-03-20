import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { RaRecord, useFieldValue, useRecordContext, useTranslate } from '@strato-admin/core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export type BooleanFieldProps<RecordType extends RaRecord = RaRecord> = FieldProps<RecordType> & {
  /**
   * The label to display when the value is true. Defaults to "Yes".
   */
  trueLabel?: string;
  /**
   * The label to display when the value is false. Defaults to "No".
   */
  falseLabel?: string;
  /**
   * Whether to show the text label alongside the icon.
   */
  showLabel?: boolean;
};

const BooleanField = <RecordType extends RaRecord = RaRecord>(props: BooleanFieldProps<RecordType>) => {
  const { source, record: recordProp, trueLabel, falseLabel, showLabel = false, link } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const translate = useTranslate();

  const isTrue = !!value;

  const content = isTrue ? (
    <StatusIndicator type="success" colorOverride="green">
      {showLabel ? (trueLabel ?? translate("strato.boolean.true", { _: 'Yes' })) : null}
    </StatusIndicator>
  ) : (
    <StatusIndicator type="not-started">
      {showLabel ? (falseLabel ?? translate("strato.boolean.false", { _: 'No' })) : null}
    </StatusIndicator>
  );

  return <RecordLink link={link}>{content}</RecordLink>;
};

export default BooleanField;
