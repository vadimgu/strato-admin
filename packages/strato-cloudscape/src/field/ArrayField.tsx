import React from 'react';
import { useRecordContext, useList, ListContextProvider, ResourceContextProvider, type RaRecord } from 'ra-core';

export interface ArrayFieldProps {
  source: string;
  label?: string;
  resource?: string;
  children: React.ReactNode;
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
export const ArrayField = <RecordType extends RaRecord = any>({
  source,
  resource,
  children,
  perPage = 10,
}: ArrayFieldProps) => {
  const record = useRecordContext<RecordType>();
  const data = record?.[source] || [];

  const targetResource = resource || source;

  const listContext = useList({
    data,
    resource: targetResource,
    perPage,
  });

  return (
    <ResourceContextProvider value={targetResource}>
      <ListContextProvider value={listContext}>
        {children}
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export default ArrayField;
