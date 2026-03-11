import React from 'react';
import { useInput, useResourceContext, useChoicesContext, useGetRecordRepresentation, type InputProps } from 'ra-core';
import CloudscapeSelect, { SelectProps as CloudscapeSelectProps } from '@cloudscape-design/components/select';
import { FormField } from './FormField';

export interface SelectInputProps extends Omit<CloudscapeSelectProps, 'onChange' | 'selectedOption' | 'options' | 'onBlur'>, InputProps {
    label?: string | false;
    choices?: Array<{ id: string | number; [key: string]: any }>;
}

export const SelectInput = (props: SelectInputProps) => {
    const { label, source, defaultValue, validate, choices: choicesProp, ...rest } = props;
    const resource = useResourceContext();
    const { allChoices, isPending } = useChoicesContext(props);
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

    const options = React.useMemo(() =>
        choices.map(choice => ({
            label: String(getRecordRepresentation(choice)),
            value: String(choice.id),
        })),
        [choices, getRecordRepresentation]
    );

    const selectedOption = options.find(option => option.value === String(field.value)) || null;

    return (
        <FormField {...props}>
            <CloudscapeSelect
                {...rest}
                id={id}
                options={options}
                selectedOption={selectedOption}
                statusType={isPending ? 'loading' : 'finished'}
                onChange={({ detail }) => field.onChange(detail.selectedOption.value)}
                onBlur={() => field.onBlur()}
            />
        </FormField>
    );
};

export default SelectInput;
