import React from 'react';
import { useInput, useResourceContext, ValidationError, useTranslate } from '@strato-admin/core';
import CloudscapeFormField from '@cloudscape-design/components/form-field';
import { FieldTitle } from './FieldTitle';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface FormFieldProps extends InputProps {
  children: React.ReactNode;
}

export const FormField = (props: FormFieldProps) => {
  const {
    children,
    label,
    source,
    defaultValue,
    validate,
    description,
    constraintText,
    info,
    secondaryControl,
    stretch,
    i18nStrings,
    ...rest
  } = props;
  const resource = useResourceContext();
  const translate = useTranslate();
  const context = useFormFieldContext();
  const inputState =
    context ??
    useInput({
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
  const errorText =
    (isTouched || isSubmitted) && invalid && typeof errorToProcess === 'string' ? (
      <ValidationError error={errorToProcess} />
    ) : undefined;

  const finalConstraintText = React.useMemo(() => {
    if (isRequired) return constraintText;
    const optionalLabel = `(${translate('optional')})`;
    if (!constraintText) return optionalLabel;
    return (
      <>
        {constraintText} ({optionalLabel})
      </>
    );
  }, [isRequired, constraintText, translate]);

  const content = (
    <CloudscapeFormField
      id={id}
      label={
        label === false ? undefined : (
          <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
        )
      }
      description={label === false ? undefined : description}
      constraintText={label === false ? undefined : finalConstraintText}
      info={info}
      secondaryControl={secondaryControl}
      stretch={stretch}
      i18nStrings={i18nStrings}
      errorText={errorText}
    >
      {children}
    </CloudscapeFormField>
  );

  if (context) {
    return content;
  }

  return <FormFieldContext.Provider value={contextValue}>{content}</FormFieldContext.Provider>;
};

export default FormField;
