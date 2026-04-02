import { useInput } from '@strato-admin/ra-core';
import CloudscapeSlider, { SliderProps as CloudscapeSliderProps } from '@cloudscape-design/components/slider';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface SliderInputProps
  extends InputProps,
    Partial<Pick<CloudscapeSliderProps, 'min' | 'max'>>,
    Pick<CloudscapeSliderProps, 'step' | 'disabled' | 'readOnly' | 'valueFormatter' | 'tickMarks' | 'referenceValues' | 'hideFillLine' | 'ariaLabel' | 'ariaDescription'> {}

export const SliderInput = (props: SliderInputProps) => {
  const { label, source, defaultValue, validate, min, max, step, disabled, readOnly, valueFormatter, tickMarks, referenceValues, hideFillLine, ariaLabel, ariaDescription, ...rest } = props;
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
  const value = typeof field.value === 'number' ? field.value : (min ?? 0);

  const inner = (
    <CloudscapeSlider
      id={id}
      min={min ?? 0}
      max={max ?? 100}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      valueFormatter={valueFormatter}
      tickMarks={tickMarks}
      referenceValues={referenceValues}
      hideFillLine={hideFillLine}
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
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
