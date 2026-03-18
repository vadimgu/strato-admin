import React from 'react';
import { EditBase, useEditContext, type RaRecord, ResourceSchemaProvider } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<_RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
  inputSchema?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  id?: any;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
  mutationOptions?: any;
  queryOptions?: any;
  redirect?: any;
  transform?: any;
  include?: string[];
  exclude?: string[];
}

const EditUI = ({
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
  const { record, isLoading } = useEditContext();

  if (isLoading || !record) {
    return null;
  }

  const finalChildren = children || <Form include={include} exclude={exclude} />;

  return (
    <ResourceSchemaProvider resource={resource} inputSchema={inputSchema}>
      <Container header={<EditHeader title={title} actions={actions} />}>{finalChildren}</Container>
    </ResourceSchemaProvider>
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
 * 
 * @example
 * // Passing a custom input schema
 * <Edit inputSchema={<InputSchema>...</InputSchema>}>
 *   <Form />
 * </Edit>
 */
export const Edit = <RecordType extends RaRecord = any>({
  children,
  inputSchema,
  title,
  actions,
  include,
  exclude,
  ...props
}: EditProps<RecordType>) => {
  return (
    <EditBase {...props}>
      <EditUI 
        resource={props.resource}
        title={title} 
        actions={actions} 
        include={include} 
        exclude={exclude}
        inputSchema={inputSchema}
      >
        {children}
      </EditUI>
    </EditBase>
  );
};

Edit.Header = EditHeader;

export default Edit;
