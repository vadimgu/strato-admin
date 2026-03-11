import React, { useMemo } from 'react';
import { ArrayInputContext, useInput, type InputProps } from 'ra-core';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';

export interface ArrayInputProps extends InputProps {
    children: React.ReactNode;
    label?: string | false;
}

export const ArrayInput = (props: ArrayInputProps) => {
    const { children, label, source: sourceProp, validate, defaultValue, ...rest } = props;
    const { control } = useFormContext();
    const contextValue = useFormFieldContext();
    
    const inputState = contextValue ?? useInput({
        source: sourceProp!,
        validate,
        defaultValue,
        ...rest,
    });
    
    const {
        fieldState: { error },
    } = inputState;

    const source = sourceProp || contextValue?.source || '';

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

    const inner = (
        <ArrayInputContext.Provider value={context}>
            {children}
        </ArrayInputContext.Provider>
    );

    if (contextValue) {
        return inner;
    }

    return (
        <FormFieldContext.Provider value={{ ...inputState, source }}>
            <FormField {...props} source={source}>
                {inner}
            </FormField>
        </FormFieldContext.Provider>
    );
};

export default ArrayInput;
