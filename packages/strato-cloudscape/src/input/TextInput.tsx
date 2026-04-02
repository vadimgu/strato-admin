import { useInput } from '@strato-admin/ra-core';
import CloudscapeInput, { InputProps as CloudscapeInputProps } from '@cloudscape-design/components/input';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface TextInputProps
  extends InputProps,
  Pick<CloudscapeInputProps, 'placeholder' | 'disabled' | 'readOnly' | 'autoFocus' | 'autoComplete' | 'spellcheck' | 'inputMode'> {
  type?: CloudscapeInputProps['type'];
}

export const TextInput = (props: TextInputProps) => {
  const {
    label,
    source,
    defaultValue,
    validate,
    description,
    constraintText,
    info,
    secondaryControl,
    type = 'text',
    placeholder,
    disabled,
    readOnly,
    autoFocus,
    autoComplete,
    spellcheck,
    inputMode,

  } = props;
  const context = useFormFieldContext();
  const inputState = context ?? useInput({ source, defaultValue, validate });
  const { field } = inputState;
  const inner = (
    <CloudscapeInput
      {...field}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      spellcheck={spellcheck}
      inputMode={inputMode}
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
      <FormField source={source} label={label} description={description} constraintText={constraintText} info={info} secondaryControl={secondaryControl}>
        {inner}
      </FormField>
    </FormFieldContext.Provider>
  );
};

export default TextInput;
