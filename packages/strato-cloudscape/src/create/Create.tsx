import React from 'react';
import { CreateBase, type RaRecord, type CreateBaseProps, Identifier, useTranslate } from '@strato-admin/ra-core';
import {
  ResourceSchemaProvider,
  useResourceSchema,
  useConstructedPageTitle,
  useSettingValue,
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
  const { label, createTitle, createDescription } = useResourceSchema();
  const translate = useTranslate();
  const constructedTitle = useConstructedPageTitle('create', label);

  const finalTitle = React.useMemo(() => {
    if (typeof title === 'function') return title({});
    if (React.isValidElement(title)) return title;
    if (title) return translate(title as string);
    if (React.isValidElement(createTitle)) return createTitle;
    if (createTitle) return translate(createTitle as string);
    return constructedTitle;
  }, [title, createTitle, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (typeof description === 'function') return description({});
    if (React.isValidElement(description)) return description;
    if (description) return translate(description as string);
    if (React.isValidElement(createDescription)) return createDescription;
    if (createDescription) return translate(createDescription as string);
    return undefined;
  }, [description, createDescription, translate]);

  const finalSaveButtonLabel = saveButtonLabel ? translate(saveButtonLabel) : translate('Create');

  const finalChildren = children || <Form include={include} exclude={exclude} saveButtonLabel={finalSaveButtonLabel} />;

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
  redirect,
  saveButtonLabel,
  ...props
}: CreateProps<RecordType>) => {
  const resolve = useSettingValue();
  const resolvedRedirect = redirect !== undefined ? redirect : resolve(undefined, 'createRedirect');
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
