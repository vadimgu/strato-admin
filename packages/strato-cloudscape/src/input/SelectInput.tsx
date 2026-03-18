
import React from 'react';
import {
  useInput,
  useResourceContext,
  useChoicesContext,
  useGetRecordRepresentation,
} from '@strato-admin/core';
import CloudscapeSelect, { SelectProps as CloudscapeSelectProps } from '@cloudscape-design/components/select';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface SelectInputProps
    extends Omit<CloudscapeSelectProps, 'onChange' | 'selectedOption' | 'options' | 'onBlur'>,
        InputProps {
    choices?: Array<{ id: string | number; [key: string]: any }>;
    /**
     * The text to display for the empty option when isRequired is false.
     * @default "-"
     */
    emptyText?: string;
}

export const SelectInput = (props: SelectInputProps) => {
    const { label, source, defaultValue, validate, choices: choicesProp, emptyText = '-', ...rest } = props;
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

  const { id, field, isRequired } = inputState;

  const choices = choicesProp || allChoices || [];

  const options = React.useMemo(() => {
    const opts = choices.map((choice) => ({
      label: String(getRecordRepresentation(choice)),
      value: String(choice.id),
    }));

    if (!isRequired) {
      opts.unshift({ label: emptyText, value: '__EMPTY__' });
    }
    return opts;
  }, [choices, getRecordRepresentation, isRequired, emptyText]);

  const selectedOption =
    options.find((option) => {
      if (!field.value) {
        return option.value === '__EMPTY__';
      }
      return option.value === String(field.value);
    }) || null;

  const inner = (
    <CloudscapeSelect
      {...rest}
      id={id}
      options={options}
      selectedOption={selectedOption}
      statusType={isPending ? 'loading' : 'finished'}
      expandToViewport={true}
      onChange={({ detail }) => {
        const value = detail.selectedOption.value === '__EMPTY__' ? null : detail.selectedOption.value;
        field.onChange(value);
      }}
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
