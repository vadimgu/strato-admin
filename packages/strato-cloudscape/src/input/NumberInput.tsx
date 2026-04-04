import { useInput } from '@strato-admin/ra-core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface NumberInputProps
  extends InputProps, Pick<CloudscapeInputProps, 'placeholder' | 'disabled' | 'readOnly' | 'autoFocus' | 'step'> {
  type?: CloudscapeInputProps['type'];
}

export const NumberInput = (props: NumberInputProps) => {
  const {
    label,
    source,
    defaultValue,
    validate,
    type = 'number',
    placeholder,
    disabled,
    readOnly,
    autoFocus,
    step,
    ...rest
  } = props;
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
      {...field}
      id={id}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      step={step}
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
