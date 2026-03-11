import React, { useMemo } from 'react';
import { ArrayInputContext, useInput, type InputProps, useResourceContext } from 'ra-core';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormField from '@cloudscape-design/components/form-field';
import { FieldTitle } from './FieldTitle';
import { ValidationError } from '../form';

export interface ArrayInputProps extends InputProps {
    children: React.ReactNode;
    label?: string;
}

export const ArrayInput = (props: ArrayInputProps) => {
    const { children, label, source, validate, defaultValue, ...rest } = props;
    const resource = useResourceContext();
    const { control } = useFormContext();
    const {
        id,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
        isRequired,
    } = useInput({
        source,
        validate,
        defaultValue,
        ...rest,
    });

    const {
        fields,
        append,
        remove,
        insert,
        move,
        prepend,
        replace,
        swap,
        update,
    } = useFieldArray({
        control,
        name: source,
    });

    const context = useMemo(
        () => ({
            append,
            fields,
            insert,
            move,
            prepend,
            remove,
            replace,
            swap,
            update,
            source,
        }),
        [append, fields, insert, move, prepend, remove, replace, swap, update, source]
    );

    const errorText = useMemo(() => {
        if (!(isTouched || isSubmitted) || !invalid || !error) {
            return undefined;
        }
        const errorToProcess = (error as any).message || (error as any).root?.message || error;
        return <ValidationError error={errorToProcess} />;
    }, [isTouched, isSubmitted, invalid, error]);

    return (
        <ArrayInputContext.Provider value={context}>
            <FormField
                id={id}
                label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                errorText={errorText}
            >
                {children}
            </FormField>
        </ArrayInputContext.Provider>
    );
};

export default ArrayInput;
