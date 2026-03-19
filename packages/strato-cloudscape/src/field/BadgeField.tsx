import Badge, { type BadgeProps } from '@cloudscape-design/components/badge';
import { type RaRecord, useFieldValue, useRecordContext } from '@strato-admin/core';
import RecordLink from '../RecordLink';
import { type FieldProps } from './types';

export interface BadgeFieldProps<RecordType extends RaRecord = RaRecord> extends FieldProps<RecordType> {
  /**
   * The color of the badge.
   * @default "grey"
   */
  color?: BadgeProps['color'];
}

const BadgeField = <RecordType extends RaRecord = RaRecord>(props: BadgeFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, link, color = 'grey' } = props;

  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as any, record });
  const hasValue = value !== null && value !== undefined && value !== '';

  if (!hasValue) {
    return <>{emptyText ?? null}</>;
  }

  return (
    <RecordLink link={link}>
      <Badge color={color}>{String(value)}</Badge>
    </RecordLink>
  );
};

export default BadgeField;
