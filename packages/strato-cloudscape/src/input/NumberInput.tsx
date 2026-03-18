
import { useInput } from '@strato-admin/core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface NumberInputProps
    extends Omit<CloudscapeInputProps, 'onChange' | 'value' | 'onBlur' | 'type'>,
        InputProps {
    type?: CloudscapeInputProps['type'];
}

export const NumberInput = (props: NumberInputProps) => {
    const { label, source, defaultValue, validate, type = 'number', ...rest } = props;
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

  const handleChange = (value: string) => {
    const floatValue = parseFloat(value);
    field.onChange(isNaN(floatValue) ? null : floatValue);
  };

  const inner = (
    <CloudscapeInput
      {...rest}
      {...field}
      id={id}
      type={type}
      value={field.value?.toString() || ''}
      onChange={(event) => handleChange(event.detail.value)}
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

export default NumberInput;
