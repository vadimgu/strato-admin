import { useInput } from '@strato-admin/ra-core';
import Toggle, { ToggleProps } from '@cloudscape-design/components/toggle';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface BooleanInputProps
  extends Omit<ToggleProps, 'onChange' | 'checked' | 'onBlur'>,
    InputProps {}

export const BooleanInput = (props: BooleanInputProps) => {
  const { label, source, defaultValue, validate, ...rest } = props;
  const context = useFormFieldContext();
  const inputState =
    context ??
    useInput({
      source,
      defaultValue: defaultValue ?? false,
      validate,
      ...rest,
    });

  const { id, field } = inputState;

  const inner = (
    <Toggle
      {...rest}
      checked={!!field.value}
      onChange={(event) => field.onChange(event.detail.checked)}
    >
      {props.children}
    </Toggle>
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

export default BooleanInput;
