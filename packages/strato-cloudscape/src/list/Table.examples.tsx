import { Table, Column, NumberColumn, DateColumn } from './Table';

export const ProductList = () => (
  <Table header="Product Catalog">
    <Column source="name" label="Product Name" />
    <Column source="category" label="Category" />
    <NumberColumn source="price" label="Price" />
    <NumberColumn source="stock" label="Inventory" />
    <DateColumn source="lastUpdated" label="Last Updated" />
  </Table>
);
