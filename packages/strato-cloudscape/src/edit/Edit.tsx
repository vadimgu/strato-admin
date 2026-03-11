import React from 'react';
import { EditBase, useEditContext, type RaRecord } from 'ra-core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';

export interface EditProps<RecordType extends RaRecord = RaRecord> {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  id?: any;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
  mutationOptions?: any;
  queryOptions?: any;
  redirect?: any;
  transform?: any;
}

const EditUI = ({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const { record, isLoading } = useEditContext();

  if (isLoading || !record) {
    return null;
  }

  return (
    <Container header={<EditHeader title={title} actions={actions} />}>
      {children}
    </Container>
  );
};

/**
 * An Edit component that provides record context and a Cloudscape Container.
 *
 * @example
 * <Edit>
 *   <SimpleForm>
 *     <TextInput source="name" />
 *   </SimpleForm>
 * </Edit>
 */
export const Edit = <RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  ...props
}: EditProps<RecordType>) => {
  return (
    <EditBase {...props}>
      <EditUI title={title} actions={actions}>
        {children}
      </EditUI>
    </EditBase>
  );
};

export default Edit;
