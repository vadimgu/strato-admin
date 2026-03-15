import React from 'react';
import { ShowBase, useShowContext, type RaRecord, ResourceSchemaProvider } from 'strato-core';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ShowHeader } from './ShowHeader';
import KeyValuePairs from './KeyValuePairs';

export interface ShowProps<_RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
  fieldSchema?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  id?: any;
  queryOptions?: any;
  include?: string[];
  exclude?: string[];
}

const ShowUI = ({
  children,
  resource,
  fieldSchema,
  title,
  actions,
  include,
  exclude,
}: {
  children?: React.ReactNode;
  resource?: string;
  fieldSchema?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
}) => {
  const { record, isLoading } = useShowContext();

  if (isLoading || !record) {
    return null;
  }

  const finalChildren = children || <KeyValuePairs include={include} exclude={exclude} />;

  return (
    <ResourceSchemaProvider resource={resource} fieldSchema={fieldSchema}>
      <Container header={<ShowHeader title={title} actions={actions} />}>
        <SpaceBetween direction="vertical" size="l">
          {finalChildren}
        </SpaceBetween>
      </Container>
    </ResourceSchemaProvider>
  );
};

/**
 * A Show component that provides record context and a Cloudscape Container.
 *
 * @example
 * <Show>
 *   <KeyValuePairs>
 *     <TextField source="name" />
 *     <NumberField source="price" />
 *   </KeyValuePairs>
 * </Show>
 * 
 * @example
 * // Using FieldSchema from context
 * <Show include={['name', 'price']} />
 * 
 * @example
 * // Passing a custom field schema
 * <Show fieldSchema={<FieldSchema>...</FieldSchema>}>
 *   <KeyValuePairs />
 * </Show>
 */
export const Show = <RecordType extends RaRecord = RaRecord>({
  children,
  fieldSchema,
  title,
  actions,
  include,
  exclude,
  ...props
}: ShowProps<RecordType>) => {
  return (
    <ShowBase {...props}>
      <ShowUI 
        resource={props.resource}
        title={title} 
        actions={actions} 
        include={include} 
        exclude={exclude}
        fieldSchema={fieldSchema}
      >
        {children}
      </ShowUI>
    </ShowBase>
  );
};

Show.Header = ShowHeader;

export default Show;
