import React from 'react';
import {
  CreateBase,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type CreateBaseProps,
  Identifier,
  useTranslate,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { CreateHeader } from './CreateHeader';
import Form from '../form/Form';

export interface CreateProps<
  RecordType extends Omit<RaRecord, 'id'> = any,
  ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  MutationOptionsError = Error,
> extends CreateBaseProps<RecordType, ResultRecordType, MutationOptionsError> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}

const CreateUI = ({
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
  const { label, labelCreate, descriptionCreate } = useResourceSchema();
  const translate = useTranslate();
  const finalTitle = title ?? labelCreate ?? (label ? `Create ${label}` : 'Create');
  const finalDescription = description ?? descriptionCreate;

  const finalSaveButtonLabel = saveButtonLabel ?? translate('ra.action.create', { _: 'Create' });

  const finalChildren = children || (
    <Form include={include} exclude={exclude} saveButtonLabel={finalSaveButtonLabel} />
  );

  return (
    <Container header={<CreateHeader title={finalTitle} description={finalDescription} actions={actions} />}>
      {finalChildren}
    </Container>
  );
};

/**
 * A Create component that provides record context and a Cloudscape Container.
 *
 * @example
 * <Create>
 *   <Form>
 *     <TextInput source="name" />
 *   </Form>
 * </Create>
 *
 * @example
 * // Using InputSchema from context
 * <Create include={['name', 'price']} />
 */
export const Create = <RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  description,
  include,
  exclude,
  redirect = 'list',
  saveButtonLabel,
  ...props
}: CreateProps<RecordType>) => {
  return (
    <CreateBase redirect={redirect} {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <CreateUI
          title={title}
          actions={actions}
          description={description}
          include={include}
          exclude={exclude}
          saveButtonLabel={saveButtonLabel}
        >
          {children}
        </CreateUI>
      </ResourceSchemaProvider>
    </CreateBase>
  );
};

Create.Header = CreateHeader;

export default Create;
