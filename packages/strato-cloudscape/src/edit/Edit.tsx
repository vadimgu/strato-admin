import React from 'react';
import {
  EditBase,
  useEditContext,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type EditBaseProps,
  useTranslate,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<RecordType extends RaRecord = RaRecord, ErrorType = Error>
  extends EditBaseProps<RecordType, ErrorType> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}

const EditUI = ({
  children,
  title,
  actions,
  description,
  include,
  exclude,
  saveButtonLabel,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  description?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}) => {
  const { record, isLoading } = useEditContext();
  const { label, labelEdit, descriptionEdit } = useResourceSchema();
  const translate = useTranslate();

  if (isLoading || !record) {
    return null;
  }

  const resolvedLabelEdit = typeof labelEdit === 'function' ? labelEdit(record) : labelEdit;
  const finalTitle =
    (typeof title === 'string' ? translate(title, { _: title }) : title) ??
    (typeof resolvedLabelEdit === 'string' ? translate(resolvedLabelEdit, { _: resolvedLabelEdit }) : resolvedLabelEdit) ??
    (label ? translate('ra.page.edit', { name: label, _: `Edit ${label}` }) : translate('ra.page.edit', { _: 'Edit' }));

  const resolvedDescriptionEdit = typeof descriptionEdit === 'function' ? descriptionEdit(record) : descriptionEdit;
  const finalDescription =
    (typeof description === 'string' ? translate(description, { _: description }) : description) ??
    (typeof resolvedDescriptionEdit === 'string'
      ? translate(resolvedDescriptionEdit, { _: resolvedDescriptionEdit })
      : resolvedDescriptionEdit);

  const finalSaveButtonLabel = saveButtonLabel
    ? translate(saveButtonLabel, { _: saveButtonLabel })
    : translate('ra.action.save', { _: 'Save' });

  const finalChildren = children || (
    <Form include={include} exclude={exclude} saveButtonLabel={finalSaveButtonLabel} />
  );

  return (
    <Container header={<EditHeader title={finalTitle} description={finalDescription} actions={actions} />}>
      {finalChildren}
    </Container>
  );
};

/**
 * An Edit component that provides record context and a Cloudscape Container.
 *
 * @example
 * <Edit>
 *   <Form>
 *     <TextInput source="name" />
 *   </Form>
 * </Edit>
 *
 * @example
 * // Using InputSchema from context
 * <Edit include={['name', 'price']} />
 */
export const Edit = <RecordType extends RaRecord = any>({
  children,
  title,
  actions,
  description,
  include,
  exclude,
  redirect = 'show',
  saveButtonLabel,
  ...props
}: EditProps<RecordType>) => {
  return (
    <EditBase redirect={redirect} {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <EditUI
          title={title}
          actions={actions}
          description={description}
          include={include}
          exclude={exclude}
          saveButtonLabel={saveButtonLabel}
        >
          {children}
        </EditUI>
      </ResourceSchemaProvider>
    </EditBase>
  );
};

Edit.Header = EditHeader;

export default Edit;
