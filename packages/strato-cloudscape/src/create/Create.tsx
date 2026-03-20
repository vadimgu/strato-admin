import React from 'react';
import {
  CreateBase,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type CreateBaseProps,
  Identifier,
  useTranslate,
  useConstructedPageTitle,
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
  title?: string | ((record: Partial<RecordType>) => string);
  description?: string | ((record: Partial<RecordType>) => string);
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
  title?: string | ((record: any) => string);
  actions?: React.ReactNode;
  description?: string | ((record: any) => string);
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
}) => {
  const { label, titleCreate, descriptionCreate } = useResourceSchema();
  const translate = useTranslate();
  const constructedTitle = useConstructedPageTitle('create', label);

  const finalTitle = React.useMemo(() => {
    if (typeof title === 'function') return title({});
    if (title) return translate(title);
    if (titleCreate) return translate(titleCreate);
    return constructedTitle;
  }, [title, titleCreate, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (typeof description === 'function') return description({});
    if (description) return translate(description);
    if (descriptionCreate) return translate(descriptionCreate);
    return undefined;
  }, [description, descriptionCreate, translate]);

  const finalSaveButtonLabel = saveButtonLabel ? translate(saveButtonLabel) : translate('Create');

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
