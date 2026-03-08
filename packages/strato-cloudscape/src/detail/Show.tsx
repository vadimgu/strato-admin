import React from 'react';
import { ShowBase, useShowContext, type RaRecord } from 'ra-core';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ShowHeader } from './ShowHeader';

export interface ShowProps<RecordType extends RaRecord = RaRecord> {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  resource?: string;
  id?: any;
  queryOptions?: any;
}

const ShowUI = ({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const { record, isLoading } = useShowContext();

  if (isLoading || !record) {
    // We could return a Spinner here, but for now we follow RA's pattern of being silent
    // or letting the user handle it if they want.
    return null;
  }

  return (
    <Container header={<ShowHeader title={title} actions={actions} />}>
      <SpaceBetween direction="vertical" size="l">
        {children}
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
 */
export const Show = <RecordType extends RaRecord = RaRecord>({
  children,
  title,
  actions,
  ...props
}: ShowProps<RecordType>) => {
  return (
    <ShowBase {...props}>
      <ShowUI title={title} actions={actions}>
        {children}
      </ShowUI>
    </ShowBase>
  );
};

export default Show;
