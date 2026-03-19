import { InputProps as InputPropsBase } from '@strato-admin/core';
import { FormFieldProps as CloudscapeFormFieldProps } from '@cloudscape-design/components/form-field';

export interface StratoInputProps<T = any>
  extends
    Omit<InputPropsBase<T>, 'label'>,
    Pick<
      CloudscapeFormFieldProps,
      'description' | 'constraintText' | 'info' | 'secondaryControl' | 'stretch' | 'i18nStrings'
    > {
  label?: string | false;
}

export type InputProps<T = any> = StratoInputProps<T>;
