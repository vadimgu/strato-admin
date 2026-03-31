import React, { ReactNode } from 'react';
import {
  useRecordContext,
  useList,
  ListContextProvider,
  ResourceContextProvider,
  type RaRecord,
} from '@strato-admin/ra-core';
import { type FieldProps } from './types';
import Table from '../list/Table';

export interface ArrayFieldProps<RecordType extends RaRecord = RaRecord> extends FieldProps<RecordType> {
  /**
   * The components to render for each item in the array.
   */
  children?: React.ReactNode;
  /**
   * Number of items per page if pagination is used within the field.
   */
  perPage?: number;
}

/**
 * ArrayField component that wraps its children with a ListContextProvider
 * and ResourceContextProvider initialized with the array data and resource name.
 *
 * This allows using components that expect a ListContext or ResourceContext
 * (like Table) to display nested arrays within a record.
 *
 * @example
 * <ArrayField source="items" label="Items">
 *   <ReferenceField source="product_id" reference="products" label="Product" />
 *   <NumberField source="quantity" label="Quantity" />
 *   <NumberField source="unit_price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
 * </ArrayField>
 *
 * NOTE ON FILTERING:
 * Client-side filtering via useList (used by the implicit Table) only searches
 * properties directly present in the array items.
 *
 * If you have a <ReferenceField> child, filtering by the referenced record's
 * name (e.g. Product Name) will NOT work by default because that data is fetched
 * asynchronously and is not in the local array.
 *
 * To enable "Deep Filtering", you can:
 * 1. Denormalize your data at the API level to include the labels in the nested items.
 * 2. Augment the 'data' array before passing it to useList by pre-fetching labels
 *    for all referenced IDs and injecting them into the items.
 */
export const ArrayField = <RecordType extends RaRecord = any>(props: ArrayFieldProps<RecordType>) => {
  const { source, resource, children, perPage = 10, label = props.source } = props;

  const record = useRecordContext<RecordType>();
  const data = (source && record?.[source]) || [];

  const targetResource = resource || source || '';

  const listContext = useList({
    data,
    resource: targetResource,
    perPage,
  });

  return (
    <ResourceContextProvider value={targetResource}>
      <ListContextProvider value={listContext as any}>
        <ArrayFieldUI title={label}>{children}</ArrayFieldUI>
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

const ArrayFieldUI = ({ children, title }: { children?: ReactNode; title?: ReactNode }) => {
  if (!children) return null;

  const childrenArray = React.Children.toArray(children);

  // Check if children already contain a Table
  const hasTable = childrenArray.some(
    (child) => React.isValidElement(child) && (child.type === Table || (child.type as any).displayName === 'Table')
  );

  if (hasTable) {
    return <>{children}</>;
  }

  // If children are provided but no Table, wrap them in a Table.
  // This supports the shorthand <ArrayField><TextField source="foo" /></ArrayField>
  return (
    <Table
      variant="embedded"
      title={title}
      selectionType={undefined}
      actions={null}
    >
      {children}
    </Table>
  );
};

export default ArrayField;
ArrayField.isCollectionField = true;
