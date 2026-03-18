
import { useInput } from '@strato-admin/core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface TextInputProps
    extends Omit<CloudscapeInputProps, 'onChange' | 'value' | 'onBlur' | 'type'>,
        InputProps {
    type?: CloudscapeInputProps['type'];
}

export const TextInput = (props: TextInputProps) => {
    const { label, source, defaultValue, validate, type = 'text', ...rest } = props;
  const context = useFormFieldContext();
  const inputState =
    context ??
    useInput({
      source,
      defaultValue,
      validate,
      ...rest,
    });

  const { id, field } = inputState;

  const inner = (
    <CloudscapeInput
      {...rest}
      {...field}
      id={id}
      type={type}
      value={field.value || ''}
      onChange={(event) => field.onChange(event.detail.value)}
      onBlur={() => field.onBlur()}
    />
  );

  if (context) {
    return inner;
  }

  return (
    <FormFieldContext.Provider value={inputState}>
      <FormField {...props}>{inner}</FormField>
    </FormFieldContext.Provider>
  );
};

export default TextInput;
