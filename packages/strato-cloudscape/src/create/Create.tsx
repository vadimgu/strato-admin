import React from 'react';
import { CreateBase, type RaRecord, ResourceSchemaProvider } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { CreateHeader } from './CreateHeader';
import Form from '../form/Form';

export interface CreateProps<RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
  inputSchema?: React.ReactNode;
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
  resource,
  inputSchema,
  title,
  actions,
  include,
  exclude,
}: {
  children?: React.ReactNode;
  resource?: string;
  inputSchema?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
}) => {
  const finalChildren = children || <Form include={include} exclude={exclude} />;
  return (
    <ResourceSchemaProvider resource={resource} inputSchema={inputSchema}>
      <Container header={<CreateHeader title={title} actions={actions} />}>{finalChildren}</Container>
    </ResourceSchemaProvider>
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
 * 
 * @example
 * // Passing a custom input schema
 * <Create inputSchema={<InputSchema>...</InputSchema>}>
 *   <Form />
 * </Create>
 */
export const Create = <RecordType extends RaRecord = RaRecord>({
  children,
  inputSchema,
  title,
  actions,
  include,
  exclude,
  ...props
}: CreateProps<RecordType>) => {
  return (
    <CreateBase {...props}>
      <CreateUI 
        resource={props.resource}
        title={title} 
        actions={actions} 
        include={include} 
        exclude={exclude}
        inputSchema={inputSchema}
      >
        {children}
      </CreateUI>
    </CreateBase>
  );
};

Create.Header = CreateHeader;

export default Create;
