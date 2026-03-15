import { ReactNode } from 'react';
import { InputProps as InputPropsBase } from 'strato-core';
import { FormFieldProps as CloudscapeFormFieldProps } from '@cloudscape-design/components/form-field';

export interface StratoInputProps<T = any>
  extends Omit<InputPropsBase<T>, 'label'>, Pick<CloudscapeFormFieldProps, 'description' | 'constraintText'> {
  label?: string | false;
}

export type InputProps<T = any> = StratoInputProps<T>;
