import { type ReactNode } from 'react';
import { ExtractRecordPaths, type BaseFieldProps, type RaRecord } from '@strato-admin/ra-core';
import { type RecordLinkType } from '../RecordLink';

/**
 * Common props for all field components in strato-cloudscape.
 */
export interface FieldProps<RecordType extends RaRecord = RaRecord> extends Omit<BaseFieldProps<RecordType>, 'source'> {
  /**
   * The property name in the record that should be displayed.
   */
  source?: ExtractRecordPaths<RecordType>;
  /**
   * The label to display for this field. If not provided, it will be inferred from the `source`.
   */
  label?: string | ReactNode;
  /**
   * Whether the field is sortable in a table.
   * @default true
   */
  sortable?: boolean;
  /**
   * Whether to link the field to another page.
   * - true: links to the 'detail' page of the current resource
   * - 'edit' | 'detail': links to the specified page type
   * - string: a custom URL
   * - function: (record, resource) => string
   */
  link?: RecordLinkType;
  /**
   * The text to display if the value is empty or null.
   */
  emptyText?: string | ReactNode;
  /**
   * Configuration for the inferred form input.
   * - object: Props passed to the inferred Input component.
   * - ReactElement: A specific Input component to use (escape hatch).
   * - false: Excludes this field from forms.
   */
  input?: Record<string, any> | React.ReactElement | false;
  /**
   * Whether the field is required.
   * This is used to automatically add validation to the inferred input
   * and potentially show warnings in display views.
   */
  isRequired?: boolean;
  /**
   * Additional text to help the user fill in the field.
   * Passed to the inferred Input component's FormField.
   */
  description?: string | ReactNode;
  /**
   * Text describing constraints (e.g., "Must be between 1 and 100").
   * Passed to the inferred Input component's FormField.
   */
  constraintText?: string | ReactNode;
}
