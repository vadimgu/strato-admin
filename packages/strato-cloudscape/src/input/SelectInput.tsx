
import React from 'react';
import {
  useInput,
  useResourceContext,
  useChoicesContext,
  useGetRecordRepresentation,
} from 'strato-core';
import CloudscapeSelect, { SelectProps as CloudscapeSelectProps } from '@cloudscape-design/components/select';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface SelectInputProps
    extends Omit<CloudscapeSelectProps, 'onChange' | 'selectedOption' | 'options' | 'onBlur'>,
        InputProps {
    choices?: Array<{ id: string | number; [key: string]: any }>;
}

export const SelectInput = (props: SelectInputProps) => {
    const { label, source, defaultValue, validate, choices: choicesProp, ...rest } = props;
  const resource = useResourceContext();
  const { allChoices, isPending } = useChoicesContext(props);
  const getRecordRepresentation = useGetRecordRepresentation(resource);
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

  const choices = choicesProp || allChoices || [];

  const options = React.useMemo(
    () =>
      choices.map((choice) => ({
        label: String(getRecordRepresentation(choice)),
        value: String(choice.id),
      })),
    [choices, getRecordRepresentation],
  );

  const selectedOption = options.find((option) => option.value === String(field.value)) || null;

  const inner = (
    <CloudscapeSelect
      {...rest}
      id={id}
      options={options}
      selectedOption={selectedOption}
      statusType={isPending ? 'loading' : 'finished'}
      onChange={({ detail }) => field.onChange(detail.selectedOption.value)}
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

export default SelectInput;
