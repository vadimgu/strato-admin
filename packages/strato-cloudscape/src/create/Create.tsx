import React from 'react';
import { CreateBase, type RaRecord, type CreateBaseProps, Identifier } from '@strato-admin/ra-core';
import { ResourceSchemaProvider, useCreateMeta, useResourceSchema, useSettings } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { CreateHeader } from './CreateHeader';
import Form from '../form/Form';

export interface CreateProps<
  RecordType extends Omit<RaRecord, 'id'> = any,
  ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  MutationOptionsError = Error,
> extends CreateBaseProps<RecordType, ResultRecordType, MutationOptionsError> {
  children?: React.ReactNode;
  title?: React.ReactNode | ((record: Partial<RecordType>) => React.ReactNode);
  description?: React.ReactNode | ((record: Partial<RecordType>) => React.ReactNode);
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
  title?: React.ReactNode | ((record: any) => React.ReactNode);
  actions?: React.ReactNode;
  description?: React.ReactNode | ((record: any) => React.ReactNode);
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}) => {
  const { title: resolvedTitle, description: resolvedDescription } = useCreateMeta({ title, description });

  const finalChildren = children || <Form include={include} exclude={exclude} saveButtonLabel={saveButtonLabel} />;

  return (
    <Container header={<CreateHeader title={resolvedTitle} description={resolvedDescription} actions={actions} />}>
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
  redirect,
  saveButtonLabel,
  ...props
}: CreateProps<RecordType>) => {
  const { createRedirect } = useResourceSchema(props.resource);
  const settings = useSettings();
  const resolvedRedirect =
    redirect !== undefined ? redirect : createRedirect !== undefined ? createRedirect : settings.createRedirect;
  return (
    <CreateBase redirect={resolvedRedirect} {...props}>
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
