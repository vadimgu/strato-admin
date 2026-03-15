import { type ReactNode } from 'react';
import { type BaseFieldProps, type RaRecord } from 'strato-core';
import { type RecordLinkType } from '../RecordLink';

/**
 * Common props for all field components in strato-cloudscape.
 */
export interface FieldProps<RecordType extends RaRecord = RaRecord>
  extends Omit<BaseFieldProps<RecordType>, 'source'> {
  /**
   * The property name in the record that should be displayed.
   */
  source?: string;
  /**
   * The label to display for this field. Usually inferred from the source.
   */
  label?: ReactNode;
  /**
   * Whether the field is sortable in a table.
   * @default true
   */
  sortable?: boolean;
  /**
   * Whether to link the field to another page.
   * - true: links to the 'edit' page of the current resource
   * - 'edit' | 'show': links to the specified page type
   * - string: a custom URL
   * - function: (record, resource) => string
   */
  link?: RecordLinkType;
  /**
   * The text to display if the value is empty or null.
   */
  emptyText?: ReactNode;
}
