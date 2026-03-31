import React from 'react';
import { Form as RaForm, type FormProps as RaFormProps, useSaveContext, useRecordContext } from '@strato-admin/ra-core';
import { useSchemaFields } from '../hooks/useSchemaFields';
import CloudscapeForm from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { SaveButton } from '../button/SaveButton';
import { CancelButton } from '../button/CancelButton';
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
  const record = useRecordContext();
  const isEditMode = record?.id != null;

  const { getEditFields, getCreateFields } = useSchemaFields();

  const finalChildren = React.useMemo(
    () => isEditMode
      ? getEditFields(children, { include, exclude })
      : getCreateFields(children, { include, exclude }),
    [isEditMode, getEditFields, getCreateFields, children, include, exclude],
  );

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
              <CancelButton />
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
