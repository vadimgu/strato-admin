import { List, DataTable } from 'strato-admin';

export const ProductList = () => (
  <List>
    <DataTable
      header="Products"
      filtering
      preferences
    >
      <DataTable.Col source="title" label="Title" sortable link="show" />
      <DataTable.Col source="brand" label="Brand" sortable />
      <DataTable.ReferenceCol source="category" reference="products/categories" label="Category" sortable />
      <DataTable.NumberCol source="price" label="Price" sortable />
      <DataTable.NumberCol source="rating" label="Rating" sortable />
      <DataTable.NumberCol source="stock" label="Stock" sortable />
    </DataTable>
  </List>
);

export default ProductList;
