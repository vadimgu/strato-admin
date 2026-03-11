import React from 'react';
import { Form, type FormProps, useSaveContext } from 'ra-core';
import CloudscapeForm from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SaveButton } from '../button/SaveButton';
import { FormField } from '../input/FormField';

export interface SimpleFormProps extends Omit<FormProps, 'children'> {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

export const SimpleForm = ({ children, toolbar, ...props }: SimpleFormProps) => {
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
    <Form {...props} onSubmit={handleSubmit}>
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
    </Form>
  );
};

SimpleForm.FormField = FormField;

export default SimpleForm;
