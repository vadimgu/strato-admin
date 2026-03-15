import React, { useState, useEffect, useMemo } from 'react';
import {
  useInput,
  useResourceContext,
  useChoicesContext,
  useGetRecordRepresentation,
} from 'strato-core';
import CloudscapeAutosuggest, {
  AutosuggestProps as CloudscapeAutosuggestProps,
} from '@cloudscape-design/components/autosuggest';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface AutocompleteInputProps
    extends Omit<CloudscapeAutosuggestProps, 'onChange' | 'value' | 'options' | 'onBlur'>,
        InputProps {
    choices?: Array<{ id: string | number; [key: string]: any }>;
}

export const AutocompleteInput = (props: AutocompleteInputProps) => {
    const { label, source, defaultValue, validate, choices: choicesProp, ...rest } = props;
  const resource = useResourceContext();
  const { allChoices, isPending, setFilters } = useChoicesContext(props);
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

  const selectedChoice = useMemo(
    () => choices.find((c) => String(c.id) === String(field.value)),
    [choices, field.value],
  );

  const [filterValue, setFilterValue] = useState('');

  // Keep track of the last value we synced from the field
  const lastSyncedValue = React.useRef<any>(undefined);

  useEffect(() => {
    if (selectedChoice) {
      setFilterValue(String(getRecordRepresentation(selectedChoice)));
      lastSyncedValue.current = field.value;
    } else if (!field.value) {
      setFilterValue('');
      lastSyncedValue.current = field.value;
    } else if (field.value !== lastSyncedValue.current) {
      // If we have a value but no choice yet, and we are not loading,
      // we show the ID as a last resort.
      if (!isPending) {
        setFilterValue(String(field.value));
        lastSyncedValue.current = field.value;
      }
    }
  }, [field.value, selectedChoice, getRecordRepresentation, isPending]);

  const options = useMemo(
    () =>
      choices.map((choice) => ({
        label: String(getRecordRepresentation(choice)),
        value: String(choice.id),
      })),
    [choices, getRecordRepresentation],
  );

  const handleChange = ({ detail }: { detail: { value: string } }) => {
    setFilterValue(detail.value);
    if (setFilters) {
      setFilters(detail.value);
    }
    // If the user cleared the input, we clear the field value
    if (detail.value === '') {
      field.onChange(null);
    }
  };

  const handleSelect = ({ detail }: { detail: { value: string } }) => {
    field.onChange(detail.value);
  };

  const inner = (
    <CloudscapeAutosuggest
      {...rest}
      id={id}
      options={options}
      value={filterValue}
      statusType={isPending ? 'loading' : 'finished'}
      onChange={handleChange}
      onSelect={handleSelect}
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

export default AutocompleteInput;
