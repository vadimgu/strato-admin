import React from 'react';
import { useInput, type InputProps } from 'ra-core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';

export interface TextInputProps extends Omit<CloudscapeInputProps, 'onChange' | 'value' | 'onBlur' | 'type'>, InputProps {
  label?: string | false;
  type?: CloudscapeInputProps['type'];
}

export const TextInput = (props: TextInputProps) => {
  const { label, source, defaultValue, validate, type = 'text', ...rest } = props;
  const {
    id,
    field,
  } = useInput({
    source,
    defaultValue,
    validate,
    ...rest,
  });

  return (
    <FormField {...props}>
      <CloudscapeInput
        {...rest}
        {...field}
        id={id}
        type={type}
        value={field.value || ''}
        onChange={(event) => field.onChange(event.detail.value)}
        onBlur={() => field.onBlur()}
      />
    </FormField>
  );
};

export default TextInput;
