import { useInput } from '@strato-admin/ra-core';
import Toggle, { ToggleProps } from '@cloudscape-design/components/toggle';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface BooleanInputProps
  extends InputProps,
    Pick<ToggleProps, 'disabled' | 'readOnly' | 'children' | 'ariaLabel'> {}

export const BooleanInput = (props: BooleanInputProps) => {
  const { label, source, defaultValue, validate, disabled, readOnly, children, ariaLabel, ...rest } = props;
  const context = useFormFieldContext();
  const inputState =
    context ??
    useInput({
      source,
      defaultValue: defaultValue ?? false,
      validate,
      ...rest,
    });

  const { field } = inputState;

  const inner = (
    <Toggle disabled={disabled} readOnly={readOnly} ariaLabel={ariaLabel} checked={!!field.value} onChange={(event) => field.onChange(event.detail.checked)}>
      {children}
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
