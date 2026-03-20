import React from 'react';
import {
  ShowBase,
  useShowContext,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type ShowBaseProps,
  useTranslate,
  useConstructedPageTitle,
} from '@strato-admin/core';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ShowHeader } from './ShowHeader';
import KeyValuePairs from './KeyValuePairs';

export interface ShowProps<RecordType extends RaRecord = RaRecord> extends ShowBaseProps<RecordType> {
  children?: React.ReactNode;
  title?: string | ((record: RecordType) => string);
  description?: string | ((record: RecordType) => string);
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
  title?: string | ((record: any) => string);
  actions?: React.ReactNode;
  description?: string | ((record: any) => string);
  include?: string[];
  exclude?: string[];
}) => {
  const { record, isLoading } = useShowContext();
  const { label, titleShow, descriptionShow } = useResourceSchema();
  const translate = useTranslate();
  const constructedTitle = useConstructedPageTitle('show', label);

  const finalTitle = React.useMemo(() => {
    if (isLoading || !record) return '';
    if (typeof title === 'function') return title(record);
    if (title) return translate(title);
    if (typeof titleShow === 'function') return titleShow(record);
    if (titleShow) return translate(titleShow);
    return constructedTitle;
  }, [isLoading, record, title, titleShow, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (isLoading || !record) return undefined;
    if (typeof description === 'function') return description(record);
    if (description) return translate(description);
    if (typeof descriptionShow === 'function') descriptionShow(record);
    if (descriptionShow) return translate(descriptionShow);
    return undefined;
  }, [isLoading, record, description, descriptionShow, translate]);

  if (isLoading || !record) {
    return null;
  }

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
