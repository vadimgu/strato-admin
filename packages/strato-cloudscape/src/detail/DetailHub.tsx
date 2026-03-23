import React, { useMemo, ReactNode, isValidElement } from 'react';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
  useTranslate,
  useResourceSchema,
  useShowContext,
  RaRecord,
} from '@strato-admin/core';
import KeyValuePairs from './KeyValuePairs';
import DetailHeader from './DetailHeader';

export interface DetailHubProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/**
 * A detail view component that organizes fields into sections based on their type.
 * Scalar fields are grouped into a Container with KeyValuePairs, while
 * collection fields (like ReferenceManyField) are displayed as separate sections
 * below the main record details.
 *
 * It also renders the DetailHeader with the record title and actions (like Edit).
 *
 * @example
 * <DetailHub />
 *
 * @example
 * <DetailHub title="Custom Title">
 *   <KeyValuePairs columns={3} />
 *   <ReferenceManyField reference="comments" target="post_id" />
 * </DetailHub>
 */
export const DetailHub = <RecordType extends RaRecord = RaRecord>(props: DetailHubProps) => {
  const { title, description, children, actions } = props;
  const { record, resource, isLoading } = useShowContext<RecordType>();
  const translate = useTranslate();
  const {
    label,
    detailTitle,
    detailDescription,
    fieldSchema: schemaChildren,
    detailInclude,
    detailExclude,
  } = useResourceSchema();

  const constructedTitle = useMemo(
    () => label || translate(`resources.${resource}.name`, { smart_count: 1 }),
    [label, translate, resource],
  );

  const finalTitle = useMemo(() => {
    if (title) return title;
    if (typeof detailTitle === 'function') return detailTitle(record);
    if (detailTitle) return translate(detailTitle);
    return constructedTitle;
  }, [record, title, detailTitle, translate, constructedTitle]);

  const finalDescription = useMemo(() => {
    if (description) return description;
    if (typeof detailDescription === 'function') detailDescription(record);
    if (detailDescription) return translate(detailDescription);
    return undefined;
  }, [record, description, detailDescription, translate]);

  const { scalarFields, collectionFields } = useMemo(() => {
    const baseChildren = React.Children.count(children) > 0 ? children : schemaChildren;
    let result = React.Children.toArray(baseChildren);

    // Apply include/exclude only if no children were provided (schema-first case)
    if (React.Children.count(children) === 0) {
      if (detailInclude) {
        result = result.filter(
          (child) => isValidElement(child) && detailInclude.includes((child.props as any).source),
        );
      } else if (detailExclude) {
        result = result.filter(
          (child) => isValidElement(child) && !detailExclude.includes((child.props as any).source),
        );
      }
    }

    const scalars = result.filter(
      (child) => isValidElement(child) && !(child.type as any).isCollectionField,
    );
    const collections = result.filter(
      (child) => isValidElement(child) && (child.type as any).isCollectionField,
    );

    return { scalarFields: scalars, collectionFields: collections };
  }, [children, schemaChildren, detailInclude, detailExclude]);

  if (isLoading || !record) {
    return null;
  }

  const hasScalarFields = scalarFields.length > 0;

  return (
    <SpaceBetween size="l">
      <DetailHeader title={finalTitle} description={finalDescription} actions={actions} />
      {hasScalarFields && (
        <Container>
          {React.Children.count(children) > 0 ? (
            <SpaceBetween size="l">{scalarFields}</SpaceBetween>
          ) : (
            <KeyValuePairs />
          )}
        </Container>
      )}
      {collectionFields}
    </SpaceBetween>
  );
};

export default DetailHub;
