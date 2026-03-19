import React from 'react';
import { CreateBase, type RaRecord, ResourceSchemaProvider, useResourceSchema } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { CreateHeader } from './CreateHeader';
import Form from '../form/Form';

export interface CreateProps<RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  record?: Partial<RecordType>;
  redirect?: any;
  transform?: any;
  mutationOptions?: any;
  include?: string[];
  exclude?: string[];
}

const CreateUI = ({
  children,
  title,
  actions,
  include,
  exclude,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
}) => {
  const { label } = useResourceSchema();
  const finalTitle = title ?? (label ? `Create ${label}` : 'Create');
  const finalChildren = children || <Form include={include} exclude={exclude} />;

  return <Container header={<CreateHeader title={finalTitle} actions={actions} />}>{finalChildren}</Container>;
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
  include,
  exclude,
  ...props
}: CreateProps<RecordType>) => {
  return (
    <CreateBase {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <CreateUI title={title} actions={actions} include={include} exclude={exclude}>
          {children}
        </CreateUI>
      </ResourceSchemaProvider>
    </CreateBase>
  );
};

Create.Header = CreateHeader;

export default Create;
