import React from 'react';
import { useInput, useResourceContext, type InputProps } from 'ra-core';
import CloudscapeFormField from '@cloudscape-design/components/form-field';
import { FieldTitle } from './FieldTitle';
import { ValidationError } from 'ra-core';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';

export interface FormFieldProps extends InputProps {
    children: React.ReactNode;
    label?: string | false;
    description?: React.ReactNode;
    constraintText?: React.ReactNode;
    info?: React.ReactNode;
}

export const FormField = (props: FormFieldProps) => {
    const { children, label, source, defaultValue, validate, description, constraintText, info, ...rest } = props;
    const resource = useResourceContext();
    const context = useFormFieldContext();
    const inputState = context ?? useInput({
        source,
        defaultValue,
        validate,
        ...rest,
    });
    
    const contextValue = React.useMemo(() => {
        if (!inputState) return undefined;
        return {
            ...inputState,
            source: source || context?.source || '',
        };
    }, [inputState, source, context?.source]);

    const {
        id,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
        isRequired,
    } = inputState;

    const errorToProcess = (error as any)?.message || (error as any)?.root?.message;
    const errorText = (isTouched || isSubmitted) && invalid && typeof errorToProcess === 'string' ? (
        <ValidationError error={errorToProcess} />
    ) : undefined;

    const content = (
        <CloudscapeFormField
            id={id}
            label={label === false ? undefined : <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
            description={description}
            constraintText={constraintText}
            info={info}
            errorText={errorText}
        >
            {children}
        </CloudscapeFormField>
    );

    if (context) {
        return content;
    }

    return (
        <FormFieldContext.Provider value={contextValue}>
            {content}
        </FormFieldContext.Provider>
    );
};

export default FormField;
