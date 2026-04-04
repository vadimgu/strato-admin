import { useInput } from '@strato-admin/ra-core';
import CloudscapeTextarea, { TextareaProps as CloudscapeTextareaProps } from '@cloudscape-design/components/textarea';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface TextAreaInputProps
  extends
    InputProps,
    Pick<CloudscapeTextareaProps, 'placeholder' | 'disabled' | 'readOnly' | 'rows' | 'autoFocus' | 'spellcheck'> {}

export const TextAreaInput = (props: TextAreaInputProps) => {
  const {
    label,
    source,
    defaultValue,
    validate,
    placeholder,
    disabled,
    readOnly,
    rows,
    autoFocus,
    spellcheck,
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

  const inner = (
    <CloudscapeTextarea
      {...field}
      id={id}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      autoFocus={autoFocus}
      spellcheck={spellcheck}
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
