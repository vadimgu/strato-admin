import React from 'react';
import { useInput, useResourceContext, type InputProps } from 'ra-core';
import CloudscapeFormField from '@cloudscape-design/components/form-field';
import { FieldTitle } from './FieldTitle';
import { ValidationError } from 'ra-core';

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
    const {
        id,
        fieldState: { isTouched, invalid, error },
        formState: { isSubmitted },
        isRequired,
    } = useInput({
        source,
        defaultValue,
        validate,
        ...rest,
    });

    if (label === false) {
        return <>{children}</>;
    }

    return (
        <CloudscapeFormField
            id={id}
            label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
            description={description}
            constraintText={constraintText}
            info={info}
            errorText={(isTouched || isSubmitted) && invalid ? <ValidationError error={error?.message} /> : undefined}
        >
            {children}
        </CloudscapeFormField>
    );
};

export default FormField;
