import React from 'react';
import { EditBase, useEditContext, type RaRecord, ResourceSchemaProvider, useResourceSchema } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<_RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
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
  const { record, isLoading } = useEditContext();
  const { label } = useResourceSchema();

  if (isLoading || !record) {
    return null;
  }

  const finalTitle = title ?? (label ? `Edit ${label}` : 'Edit');
  const finalChildren = children || <Form include={include} exclude={exclude} />;

  return <Container header={<EditHeader title={finalTitle} actions={actions} />}>{finalChildren}</Container>;
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
  include,
  exclude,
  ...props
}: EditProps<RecordType>) => {
  return (
    <EditBase {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <EditUI title={title} actions={actions} include={include} exclude={exclude}>
          {children}
        </EditUI>
      </ResourceSchemaProvider>
    </EditBase>
  );
};

Edit.Header = EditHeader;

export default Edit;
