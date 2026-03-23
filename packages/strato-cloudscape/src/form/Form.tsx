import React from 'react';
import { Form as RaForm, type FormProps as RaFormProps, useSaveContext, useResourceSchema } from '@strato-admin/core';
import CloudscapeForm from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SaveButton } from '../button/SaveButton';
import { FormField } from '../input/FormField';

export interface FormProps extends Omit<RaFormProps, 'children'> {
  children?: React.ReactNode;
  /**
   * List of field sources to include in the form.
   */
  include?: string[];
  /**
   * List of field sources to exclude from the form.
   */
  exclude?: string[];
  toolbar?: React.ReactNode;
  /**
   * Label for the save button.
   */
  saveButtonLabel?: string;
}

export const Form = ({ children, include, exclude, toolbar, saveButtonLabel, ...props }: FormProps) => {
  const saveContext = useSaveContext();
  const { inputSchema: schemaChildren, formInclude, formExclude } = useResourceSchema();

  const finalChildren = React.useMemo(() => {
    const baseChildren = children || schemaChildren;
    let result = React.Children.toArray(baseChildren);

    const finalInclude = include || formInclude;
    const finalExclude = exclude || formExclude;

    if (finalInclude) {
      result = result.filter(
        (child) => React.isValidElement(child) && finalInclude.includes((child.props as any).source),
      );
    } else if (finalExclude) {
      result = result.filter(
        (child) => React.isValidElement(child) && !finalExclude.includes((child.props as any).source),
      );
    }

    return result;
  }, [children, schemaChildren, include, exclude, formInclude, formExclude]);

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
              <SaveButton label={saveButtonLabel} />
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
