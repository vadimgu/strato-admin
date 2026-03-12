import React from 'react';
import { Form as RaForm, type FormProps as RaFormProps, useSaveContext } from 'ra-core';
import CloudscapeForm from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SaveButton } from '../button/SaveButton';
import { FormField } from '../input/FormField';

export interface FormProps extends Omit<RaFormProps, 'children'> {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

export const Form = ({ children, toolbar, ...props }: FormProps) => {
  const saveContext = useSaveContext();
  
  const handleSubmit = async (values: any, event: any) => {
    if (props.onSubmit) {
        return props.onSubmit(values, event);
    }
    if (saveContext?.save) {
        return saveContext.save(values, event);
    }
  };

  return (
    <RaForm {...props} onSubmit={handleSubmit}>
      <CloudscapeForm
        actions={
          toolbar || (
            <SpaceBetween direction="horizontal" size="xs">
              <SaveButton />
            </SpaceBetween>
          )
        }
      >
        <SpaceBetween direction="vertical" size="l">
          {children}
        </SpaceBetween>
      </CloudscapeForm>
    </RaForm>
  );
};

Form.Field = FormField;

export default Form;
