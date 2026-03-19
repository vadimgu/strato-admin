import {
  useRecordContext,
  useList,
  ListContextProvider,
  ResourceContextProvider,
  type RaRecord,
} from '@strato-admin/core';
import { type FieldProps } from './types';

export interface ArrayFieldProps<RecordType extends RaRecord = RaRecord> extends FieldProps<RecordType> {
  /**
   * Thecomponents to render for each item in the array.
   */
  children: React.ReactNode;
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
 * (like DataTable) to display nested arrays within a record.
 *
 * @example
 * <ArrayField source="products" resource="products">
 *   <DataTable variant="embedded">
 *     <DataTable.Col source="title" label="Title" />
 *     <DataTable.NumberCol source="price" label="Price" />
 *   </DataTable>
 * </ArrayField>
 */
export const ArrayField = <RecordType extends RaRecord = any>(props: ArrayFieldProps<RecordType>) => {
  const { source, resource, children, perPage = 10 } = props;

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
      <ListContextProvider value={listContext}>{children as any}</ListContextProvider>
    </ResourceContextProvider>
  );
};

export default ArrayField;
