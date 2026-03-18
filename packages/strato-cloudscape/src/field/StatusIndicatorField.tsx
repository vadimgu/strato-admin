import StatusIndicator, { type StatusIndicatorProps } from '@cloudscape-design/components/status-indicator';
import React, { type ReactElement } from 'react';
import { type RaRecord, useFieldValue, useRecordContext, useTranslate } from '@strato-admin/core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export interface StatusIndicatorLabelProps {
  /**
   * The value to match against the field's value.
   */
  value: any;
  /**
   * The type of the status indicator for this value.
   */
  type: StatusIndicatorProps.Type;
  /**
   * Color override for the status indicator for this value.
   */
  color?: StatusIndicatorProps.Color;
  /**
   * The label to display. If not provided, the value will be used.
   */
  label?: React.ReactNode;
}

/**
 * A declarative way to define status indicator mapping.
 */
export const StatusIndicatorLabel = (_: StatusIndicatorLabelProps) => null;

export interface StatusIndicatorFieldProps<RecordType extends RaRecord = RaRecord>
  extends FieldProps<RecordType> {
  /**
   * The type of the status indicator.
   * If provided as a string, it will be used for all values.
   * If provided as a function, it will be called with the field value and the record.
   * @default "info"
   */
  type?: StatusIndicatorProps.Type | ((value: any, record: RecordType) => StatusIndicatorProps.Type);
  /**
   * A mapping from field values to status indicator types.
   */
  mapping?: Record<string | number, StatusIndicatorProps.Type>;
  /**
   * Icon aria label for screen readers.
   */
  iconAriaLabel?: string;
  /**
   * Color override for the status indicator.
   */
  colorOverride?: StatusIndicatorProps.Color;
  /**
   * Declarative mapping using StatusIndicatorLabel children.
   */
  children?: React.ReactNode;
}

const StatusIndicatorField = <RecordType extends RaRecord = RaRecord>(
  props: StatusIndicatorFieldProps<RecordType>
) => {
  const {
    source,
    record: recordProp,
    emptyText,
    link,
    type,
    mapping,
    iconAriaLabel,
    colorOverride,
    children,
  } = props;

  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const translate = useTranslate();
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  // 1. Try to find mapping from children
  const childrenArray = React.Children.toArray(children) as ReactElement<StatusIndicatorLabelProps>[];
  const matchingLabel = childrenArray.find((child) => child.props?.value === value);

  let statusType: StatusIndicatorProps.Type = 'info';
  let finalColorOverride = colorOverride;
  let label: React.ReactNode = String(value);

  if (matchingLabel) {
    statusType = matchingLabel.props.type;
    if (matchingLabel.props.color) {
      finalColorOverride = matchingLabel.props.color;
    }
    if (matchingLabel.props.label) {
      label = typeof matchingLabel.props.label === 'string'
        ? translate(matchingLabel.props.label)
        : matchingLabel.props.label;
    }
  } else if (typeof type === 'function') {
    statusType = type(value, record as RecordType);
  } else if (type) {
    statusType = type;
  } else if (mapping && (value as string | number) in mapping) {
    statusType = mapping[value as string | number];
  }

  return (
    <RecordLink link={link}>
      <StatusIndicator type={statusType} iconAriaLabel={iconAriaLabel} colorOverride={finalColorOverride}>
        {label}
      </StatusIndicator>
    </RecordLink>
  );
};

StatusIndicatorField.Label = StatusIndicatorLabel;

export default StatusIndicatorField;
