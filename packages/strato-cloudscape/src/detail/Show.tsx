import React from 'react';
import { ShowBase, useShowContext, type RaRecord, ResourceSchemaProvider, useResourceSchema } from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ShowHeader } from './ShowHeader';
import KeyValuePairs from './KeyValuePairs';

export interface ShowProps<_RecordType extends RaRecord = RaRecord> {
  children?: React.ReactNode;
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
  const { record, isLoading } = useShowContext();
  const { label } = useResourceSchema();

  if (isLoading || !record) {
    return null;
  }

  const finalTitle = title ?? (label ? `${label} Details` : 'Details');
  const finalChildren = children || <KeyValuePairs include={include} exclude={exclude} />;

  return (
    <Container header={<ShowHeader title={finalTitle} actions={actions} />}>
      <SpaceBetween direction="vertical" size="l">
        {finalChildren}
      </SpaceBetween>
    </Container>
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
 */
export const Show = <RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  include,
  exclude,
  ...props
}: ShowProps<RecordType>) => {
  return (
    <ShowBase {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <ShowUI
          title={title}
          actions={actions}
          include={include}
          exclude={exclude}
        >
          {children}
        </ShowUI>
      </ResourceSchemaProvider>
    </ShowBase>
  );
};

Show.Header = ShowHeader;

export default Show;
