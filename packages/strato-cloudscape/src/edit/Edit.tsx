import React from 'react';
import {
  EditBase,
  useEditContext,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type EditBaseProps,
  useTranslate,
  useConstructedPageTitle,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<RecordType extends RaRecord = RaRecord, ErrorType = Error>
  extends EditBaseProps<RecordType, ErrorType> {
  children?: React.ReactNode;
  title?: string | ((record: RecordType) => string);
  description?: string | ((record: RecordType) => string);
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
  title?: string | ((record: any) => string);
  actions?: React.ReactNode;
  description?: string | ((record: any) => string);
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}) => {
  const { record, isLoading } = useEditContext();
  const { label, editTitle, editDescription } = useResourceSchema();
  const translate = useTranslate();
  const constructedTitle = useConstructedPageTitle('edit', label);

  const finalTitle = React.useMemo(() => {
    if (isLoading || !record) return '';
    if (typeof title === 'function') return title(record);
    if (title) return translate(title);
    if (typeof editTitle === 'function') return editTitle(record);
    if (editTitle) return translate(editTitle);
    return constructedTitle;
  }, [isLoading, record, title, editTitle, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (isLoading || !record) return undefined;
    if (typeof description === 'function') return description(record);
    if (description) return translate(description);
    if (typeof editDescription === 'function') return editDescription(record);
    if (editDescription) return translate(editDescription);
    return undefined;
  }, [isLoading, record, description, editDescription, translate]);

  if (isLoading || !record) {
    return null;
  }

  const finalSaveButtonLabel = saveButtonLabel ? translate(saveButtonLabel) : translate('Save');

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
