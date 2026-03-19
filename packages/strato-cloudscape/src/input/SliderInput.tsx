import { useInput } from '@strato-admin/core';
import CloudscapeSlider, { SliderProps as CloudscapeSliderProps } from '@cloudscape-design/components/slider';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface SliderInputProps
  extends Omit<CloudscapeSliderProps, 'onChange' | 'value' | 'i18nStrings'>, InputProps {}

export const SliderInput = (props: SliderInputProps) => {
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

  // Cloudscape Slider requires a number value
  const value = typeof field.value === 'number' ? field.value : (props.min ?? 0);

  const inner = (
    <CloudscapeSlider
      {...(rest as any)}
      id={id}
      value={value}
      onChange={(event) => field.onChange(event.detail.value)}
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

export default SliderInput;
