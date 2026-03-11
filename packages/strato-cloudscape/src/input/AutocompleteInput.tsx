import React, { useState, useEffect, useMemo } from 'react';
import { useInput, useResourceContext, useChoicesContext, useGetRecordRepresentation, type InputProps } from 'ra-core';
import CloudscapeAutosuggest, { AutosuggestProps as CloudscapeAutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { FormField } from './FormField';

export interface AutocompleteInputProps extends Omit<CloudscapeAutosuggestProps, 'onChange' | 'value' | 'options' | 'onBlur'>, InputProps {
    label?: string | false;
    choices?: Array<{ id: string | number;[key: string]: any }>;
}

export const AutocompleteInput = (props: AutocompleteInputProps) => {
    const { label, source, defaultValue, validate, choices: choicesProp, ...rest } = props;
    const resource = useResourceContext();
    const { allChoices, isPending, setFilters } = useChoicesContext(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const {
        id,
        field,
    } = useInput({
        source,
        defaultValue,
        validate,
        ...rest,
    });

    const choices = choicesProp || allChoices || [];

    const selectedChoice = useMemo(() =>
        choices.find(c => String(c.id) === String(field.value)),
        [choices, field.value]
    );

    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        if (selectedChoice) {
            setFilterValue(String(getRecordRepresentation(selectedChoice)));
        } else if (!field.value) {
            setFilterValue('');
        } else {
            setFilterValue(String(field.value));
        }
    }, [field.value, selectedChoice, getRecordRepresentation]);

    const options = useMemo(() =>
        choices.map(choice => ({
            label: String(getRecordRepresentation(choice)),
            value: String(choice.id),
        })),
        [choices, getRecordRepresentation]
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

    return (
        <FormField {...props}>
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
        </FormField>
    );
};

export default AutocompleteInput;
