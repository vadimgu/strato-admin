import React from 'react';
import { InputProps as InputPropsBase, Validator } from '@strato-admin/ra-core';
import { FormFieldProps as CloudscapeFormFieldProps } from '@cloudscape-design/components/form-field';

/**
 * Common props shared by all Strato Admin input components.
 */
export interface StratoCommonInputProps<T = any> {
  /** The field name in the record. Used to read and write the value. */
  source: string;
  /** Override the auto-generated label. Pass `false` to hide the label entirely. */
  label?: string | false;
  /** The initial value when no record value exists. */
  defaultValue?: any;
  /** Validation rule or array of rules. Use built-in validators (`required()`, `minLength()`, etc.) or provide a custom function. */
  validate?: Validator | Validator[];
  /** Transforms the record value before passing it to the input (record → input). */
  format?: (value: T) => any;
  /** Transforms the input value before saving to the record (input → record). */
  parse?: (value: any) => T;
  /** When `true`, the value is visible but cannot be changed. */
  readOnly?: boolean;
  /** When `true`, the input is non-interactive and grayed out. */
  disabled?: boolean;
  /** Helper text displayed below the label. */
  description?: React.ReactNode;
  /** Additional constraint text. Appended with "(optional)" when the field is not required. */
  constraintText?: React.ReactNode;
  /** Info link displayed next to the label (Cloudscape `info` slot). */
  info?: React.ReactNode;
  /** Secondary control displayed to the right of the input (Cloudscape `secondaryControl` slot). */
  secondaryControl?: React.ReactNode;
  /** When `true`, the form field stretches to fill its container width. */
  stretch?: boolean;
}

export interface StratoInputProps<T = any>
  extends
    StratoCommonInputProps<T>,
    Omit<
      InputPropsBase<T>,
      'label' | 'source' | 'defaultValue' | 'validate' | 'format' | 'parse' | 'readOnly' | 'disabled'
    >,
    Pick<CloudscapeFormFieldProps, 'i18nStrings'> {}

export type InputProps<T = any> = StratoInputProps<T>;
