import { useInput } from '@strato-admin/ra-core';
import CloudscapeTextarea, { TextareaProps as CloudscapeTextareaProps } from '@cloudscape-design/components/textarea';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface TextAreaInputProps
  extends Omit<CloudscapeTextareaProps, 'onChange' | 'value' | 'onBlur'>, InputProps {}

export const TextAreaInput = (props: TextAreaInputProps) => {
  const { label, source, defaultValue, validate, ...rest } = props;
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
    <CloudscapeTextarea
      {...rest}
      {...field}
      id={id}
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

export default TextAreaInput;
