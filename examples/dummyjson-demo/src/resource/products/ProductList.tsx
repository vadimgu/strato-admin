import { List, Table } from 'strato-admin';

export const ProductList = () => (
  <List>
    <Table header="Products" filtering preferences>
      <Table.Column source="title" label="Title" sortable link="show" />
      <Table.Column source="brand" label="Brand" sortable />
      <Table.ReferenceColumn source="category" reference="products/categories" label="Category" sortable />
      <Table.NumberColumn source="price" label="Price" sortable />
      <Table.NumberColumn source="rating" label="Rating" sortable />
      <Table.NumberColumn source="stock" label="Stock" sortable />
    </Table>
  </List>
);

export default ProductList;
