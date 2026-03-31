import React from 'react';
import {
  EditBase,
  useEditContext,
  type RaRecord,
  type EditBaseProps,
  useTranslate,
} from '@strato-admin/ra-core';
import {
  ResourceSchemaProvider,
  useResourceSchema,
  useConstructedPageTitle,
  useSettingValue,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<RecordType extends RaRecord = RaRecord, ErrorType = Error>
  extends EditBaseProps<RecordType, ErrorType> {
  children?: React.ReactNode;
  title?: React.ReactNode | ((record: RecordType) => React.ReactNode);
  description?: React.ReactNode | ((record: RecordType) => React.ReactNode);
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
  title?: React.ReactNode | ((record: any) => React.ReactNode);
  actions?: React.ReactNode;
  description?: React.ReactNode | ((record: any) => React.ReactNode);
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
    if (React.isValidElement(title)) return title;
    if (title) return translate(title as string, record);
    if (typeof editTitle === 'function') return editTitle(record);
    if (React.isValidElement(editTitle)) return editTitle;
    if (editTitle) return translate(editTitle as string, record);
    return constructedTitle;
  }, [isLoading, record, title, editTitle, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (isLoading || !record) return undefined;
    if (typeof description === 'function') return description(record);
    if (React.isValidElement(description)) return description;
    if (description) return translate(description as string, record);
    if (typeof editDescription === 'function') return editDescription(record);
    if (React.isValidElement(editDescription)) return editDescription;
    if (editDescription) return translate(editDescription as string, record);
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
  redirect,
  saveButtonLabel,
  ...props
}: EditProps<RecordType>) => {
  const { queryOptions } = useResourceSchema(props.resource);
  const resolve = useSettingValue();
  const resolvedRedirect = redirect !== undefined ? redirect : resolve(undefined, 'editRedirect');

  return (
    <EditBase redirect={resolvedRedirect} queryOptions={queryOptions} {...props}>
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
