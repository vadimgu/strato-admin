import React from 'react';
import { useInput, type InputProps } from 'ra-core';
import CloudscapeTextarea, { TextareaProps as CloudscapeTextareaProps } from '@cloudscape-design/components/textarea';
import { FormField } from './FormField';

export interface TextAreaInputProps extends Omit<CloudscapeTextareaProps, 'onChange' | 'value' | 'onBlur'>, InputProps {
  label?: string | false;
}

export const TextAreaInput = (props: TextAreaInputProps) => {
  const { label, source, defaultValue, validate, ...rest } = props;
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
      <CloudscapeTextarea
        {...rest}
        {...field}
        id={id}
        value={field.value || ''}
        onChange={(event) => field.onChange(event.detail.value)}
        onBlur={() => field.onBlur()}
      />
    </FormField>
  );
};

export default TextAreaInput;
