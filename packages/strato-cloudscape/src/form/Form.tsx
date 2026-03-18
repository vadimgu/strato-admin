import React from 'react';
import { Form as RaForm, type FormProps as RaFormProps, useSaveContext, useInputSchema } from '@strato-admin/core';
import CloudscapeForm from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SaveButton } from '../button/SaveButton';
import { FormField } from '../input/FormField';

export interface FormProps extends Omit<RaFormProps, 'children'> {
  children?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  toolbar?: React.ReactNode;
}

export const Form = ({ children, include, exclude, toolbar, ...props }: FormProps) => {
  const saveContext = useSaveContext();
  const schemaChildren = useInputSchema();

  const finalChildren = React.useMemo(() => {
    const baseChildren = children || schemaChildren;
    let result = React.Children.toArray(baseChildren);

    if (include) {
      result = result.filter(
        (child) => React.isValidElement(child) && include.includes((child.props as any).source)
      );
    } else if (exclude) {
      result = result.filter(
        (child) => React.isValidElement(child) && !exclude.includes((child.props as any).source)
      );
    }

    return result;
  }, [children, schemaChildren, include, exclude]);

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
          {finalChildren}
        </SpaceBetween>
      </CloudscapeForm>
    </RaForm>
  );
};

Form.Field = FormField;

export default Form;
