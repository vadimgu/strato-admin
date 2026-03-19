import React from 'react';
import {
  ShowBase,
  useShowContext,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type ShowBaseProps,
  useTranslate,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ShowHeader } from './ShowHeader';
import KeyValuePairs from './KeyValuePairs';

export interface ShowProps<RecordType extends RaRecord = RaRecord> extends ShowBaseProps<RecordType> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  include?: string[];
  exclude?: string[];
}

const ShowUI = ({
  children,
  title,
  actions,
  description,
  include,
  exclude,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  description?: React.ReactNode;
  include?: string[];
  exclude?: string[];
}) => {
  const { record, isLoading } = useShowContext();
  const { label, labelShow, descriptionShow } = useResourceSchema();
  const translate = useTranslate();

  if (isLoading || !record) {
    return null;
  }

  const resolvedLabelShow = typeof labelShow === 'function' ? labelShow(record) : labelShow;
  const finalTitle =
    (typeof title === 'string' ? translate(title, { _: title }) : title) ??
    (typeof resolvedLabelShow === 'string' ? translate(resolvedLabelShow, { _: resolvedLabelShow }) : resolvedLabelShow) ??
    (label ? translate('ra.page.show', { name: label, _: `${label} Details` }) : translate('ra.page.show', { _: 'Details' }));

  const resolvedDescriptionShow = typeof descriptionShow === 'function' ? descriptionShow(record) : descriptionShow;
  const finalDescription =
    (typeof description === 'string' ? translate(description, { _: description }) : description) ??
    (typeof resolvedDescriptionShow === 'string'
      ? translate(resolvedDescriptionShow, { _: resolvedDescriptionShow })
      : resolvedDescriptionShow);

  const finalChildren = children || <KeyValuePairs include={include} exclude={exclude} />;

  return (
    <Container header={<ShowHeader title={finalTitle} description={finalDescription} actions={actions} />}>
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
  description,
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
          description={description}
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
