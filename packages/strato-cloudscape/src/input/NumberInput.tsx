import React from 'react';
import { useInput, type InputProps } from 'ra-core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';

export interface NumberInputProps extends Omit<CloudscapeInputProps, 'onChange' | 'value' | 'onBlur' | 'type'>, InputProps {
  label?: string | false;
  type?: CloudscapeInputProps['type'];
}

export const NumberInput = (props: NumberInputProps) => {
  const { label, source, defaultValue, validate, type = 'number', ...rest } = props;
  const {
    id,
    field,
  } = useInput({
    source,
    defaultValue,
    validate,
    ...rest,
  });

  const handleChange = (value: string) => {
    const floatValue = parseFloat(value);
    field.onChange(isNaN(floatValue) ? null : floatValue);
  };

  return (
    <FormField {...props}>
      <CloudscapeInput
        {...rest}
        {...field}
        id={id}
        type={type}
        value={field.value?.toString() || ''}
        onChange={(event) => handleChange(event.detail.value)}
        onBlur={() => field.onBlur()}
      />
    </FormField>
  );
};

export default NumberInput;
