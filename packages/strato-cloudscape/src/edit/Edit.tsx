import React from 'react';
import {
  EditBase,
  useEditContext,
  type RaRecord,
  type EditBaseProps,
  useNotify,
  useRedirect,
} from '@strato-admin/ra-core';
import { ResourceSchemaProvider, useResourceSchema, useEditMeta, useSettings } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import { EditHeader } from './EditHeader';
import Form from '../form/Form';

export interface EditProps<RecordType extends RaRecord = RaRecord, ErrorType = Error> extends EditBaseProps<
  RecordType,
  ErrorType
> {
  children?: React.ReactNode;
  title?: React.ReactNode | ((record: RecordType) => React.ReactNode);
  description?: React.ReactNode | ((record: RecordType) => React.ReactNode);
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  saveButtonLabel?: string;
  redirect?: false | 'list' | 'detail';
}

const EditUI = ({
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
  const { record, isLoading } = useEditContext();
  const { title: resolvedTitle, description: resolvedDescription } = useEditMeta({ title, description });

  if (isLoading || !record) {
    return null;
  }

  const finalChildren = children || <Form include={include} exclude={exclude} saveButtonLabel={saveButtonLabel} />;

  return (
    <Container header={<EditHeader title={resolvedTitle} description={resolvedDescription} actions={actions} />}>
      {finalChildren}
    </Container>
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
 */
export const Edit = <RecordType extends RaRecord = any>({
  children,
  title,
  actions,
  description,
  include,
  exclude,
  redirect,
  saveButtonLabel,
  ...props
}: EditProps<RecordType>) => {
  const { editRedirect, editSuccessMessage: schemaSuccessMessage, queryOptions } = useResourceSchema(props.resource);
  const settings = useSettings();
  const resolvedRedirect =
    redirect !== undefined ? redirect : editRedirect !== undefined ? editRedirect : settings.editRedirect;
  const editSuccessMessage =
    schemaSuccessMessage ?? (settings.editSuccessMessage as string | React.ReactNode | undefined);
  const notify = useNotify();
  const redirectFn = useRedirect();

  const mutationOptions = React.useMemo(() => {
    if (!editSuccessMessage || props.mutationOptions?.onSuccess) return props.mutationOptions;
    return {
      ...props.mutationOptions,
      onSuccess: (data: RecordType) => {
        notify(editSuccessMessage, { type: 'info' });
        redirectFn(resolvedRedirect ?? 'detail', props.resource ?? '', data.id, data);
      },
    };
  }, [editSuccessMessage, props.mutationOptions, props.resource, notify, redirectFn, resolvedRedirect]);

  return (
    <EditBase redirect={resolvedRedirect} queryOptions={queryOptions} {...props} mutationOptions={mutationOptions}>
      <ResourceSchemaProvider resource={props.resource}>
        <EditUI
          title={title ?? undefined}
          actions={actions}
          description={description}
          include={include}
          exclude={exclude}
          saveButtonLabel={saveButtonLabel}
        >
          {children}
        </EditUI>
      </ResourceSchemaProvider>
    </EditBase>
  );
};

Edit.Header = EditHeader;

export default Edit;
