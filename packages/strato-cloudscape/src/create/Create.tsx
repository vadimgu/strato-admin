import React from 'react';
import { CreateBase, type RaRecord } from 'ra-core';
import Container from '@cloudscape-design/components/container';
import { CreateHeader } from './CreateHeader';

export interface CreateProps<RecordType extends RaRecord = RaRecord> {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  record?: Partial<RecordType>;
  redirect?: any;
  transform?: any;
  mutationOptions?: any;
}

const CreateUI = ({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <Container header={<CreateHeader title={title} actions={actions} />}>
      {children}
    </Container>
  );
};

/**
 * A Create component that provides record context and a Cloudscape Container.
 *
 * @example
 * <Create>
 *   <SimpleForm>
 *     <TextInput source="name" />
 *   </SimpleForm>
 * </Create>
 */
export const Create = <RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  ...props
}: CreateProps<RecordType>) => {
  return (
    <CreateBase {...props}>
      <CreateUI title={title} actions={actions}>
        {children}
      </CreateUI>
    </CreateBase>
  );
};

Create.Header = CreateHeader;

export default Create;
