/**
 * CategoryList implementation using Cloudscape collection hooks.
 *
 * Why this approach?
 * 1. DummyJSON's /products/categories endpoint returns the entire list at once and
 *    doesn't support server-side filtering (search), sorting, or pagination.
 * 2. By using @cloudscape-design/collection-hooks directly, we can provide a rich,
 *    highly-interactive experience (searching, sorting, and paging) entirely on the client.
 * 3. We still use React-Admin's ListBase/useListContext to manage the initial data fetch
 *    via the data provider, which handles the necessary mapping of raw strings/objects
 *    into structured records with unique IDs.
 */
import { Box } from '@cloudscape-design/components';
import { useListContext, ListBase, RecordContextProvider, ArrayField, Table } from 'strato-admin';

const CategoryListInternal = () => {
  const { data, isLoading, isFetching } = useListContext();

  if (isLoading && !data) return null;

  return (
    <RecordContextProvider value={{ categories: data || [] }}>
      <ArrayField source="categories" resource="products/categories">
        <Table
          header="Categories"
          filtering
          preferences
          loading={isLoading || isFetching}
          loadingText="Loading categories..."
          empty={
            <Box textAlign="center" color="inherit">
              <b>No categories</b>
              <Box variant="p" color="inherit">
                No categories found.
              </Box>
            </Box>
          }
        >
          <Table.Column source="name" label="Name" sortable />
          <Table.Column source="slug" label="Slug" sortable />
          <Table.Column source="url" label="URL" sortable />
        </Table>
      </ArrayField>
    </RecordContextProvider>
  );
};

export const CategoryList = () => (
  <ListBase resource="products/categories">
    <CategoryListInternal />
  </ListBase>
);

export default CategoryList;
