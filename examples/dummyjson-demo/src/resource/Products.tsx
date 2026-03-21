import {
  ResourceSchema,
  TextField,
  NumberField,
  ReferenceField,
  useListContext,
  ListBase,
  RecordContextProvider,
  ArrayField,
  Table,
  Show,
  KeyValuePairs,
} from '@strato-admin/admin';
import { Box } from '@cloudscape-design/components';

const required = (value: any) => (value ? undefined : 'Required');

const ProductShow = () => (
  <Show title="Product Details">
    <KeyValuePairs columns={3}>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="brand" label="Brand" />
      <ReferenceField source="category" reference="products/categories" label="Category" link="show" />
      <NumberField source="price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
      <NumberField source="discountPercentage" label="Discount %" />
      <NumberField source="rating" label="Rating" />
      <NumberField source="stock" label="Stock" />
    </KeyValuePairs>
    <KeyValuePairs columns={1}>
      <TextField source="description" label="Description" />
    </KeyValuePairs>
  </Show>
);

export const productsResource = (
  <ResourceSchema name="products" recordRepresentation={(record) => record.title} label="Products" show={ProductShow}>
    <TextField source="title" label="Title" link="show" sortable input={{ constraints: [required] }} />
    <TextField source="brand" label="Brand" sortable />
    <ReferenceField source="category" reference="products/categories" label="Category" link="show" sortable />
    <NumberField
      source="price"
      label="Price"
      options={{ style: 'currency', currency: 'USD' }}
      sortable
      input={{ constraints: [required] }}
    />
    <NumberField source="rating" label="Rating" sortable />
    <NumberField source="stock" label="Stock" sortable />
    <TextField source="description" label="Description" input={{ multiline: true }} />
  </ResourceSchema>
);

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

const CategoryList = () => (
  <ListBase resource="products/categories">
    <CategoryListInternal />
  </ListBase>
);

export const categoriesResource = (
  <ResourceSchema
    name="products/categories"
    list={CategoryList}
    recordRepresentation={(record) => record.name}
    label="Categories"
  />
);
