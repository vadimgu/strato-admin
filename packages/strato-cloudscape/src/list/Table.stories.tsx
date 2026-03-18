import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, Column, NumberColumn, DateColumn } from './Table';
import { ResourceContext, CoreAdminContext, ListContextProvider } from '@strato-admin/core';
import { ProductList } from './Table.examples';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <CoreAdminContext dataProvider={{} as any}>
        <ResourceContext.Provider value="products">
          <Story />
        </ResourceContext.Provider>
      </CoreAdminContext>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

const items = [
  { id: 1, name: 'Wireless Mouse', category: 'Accessories', price: 25.99, stock: 150, lastUpdated: '2024-03-10' },
  { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', price: 89.99, stock: 45, lastUpdated: '2024-03-08' },
  { id: 3, name: '27-inch Monitor', category: 'Hardware', price: 299.99, stock: 20, lastUpdated: '2024-03-05' },
  { id: 4, name: 'USB-C Cable', category: 'Accessories', price: 12.5, stock: 500, lastUpdated: '2024-03-11' },
  { id: 5, name: 'Laptop Pro 14', category: 'Hardware', price: 1499.0, stock: 10, lastUpdated: '2024-03-01' },
];

const listContext = {
  data: items,
  total: items.length,
  isPending: false,
  isFetching: false,
  isLoading: false,
  page: 1,
  perPage: 10,
  setPage: () => {},
  setPerPage: () => {},
  sort: { field: 'name', order: 'ASC' },
  setSort: () => {},
  filterValues: {},
  setFilters: () => {},
  selectedIds: [],
  onSelect: () => {},
  onToggleItem: () => {},
  onUnselectItems: () => {},
  resource: 'products',
} as any;

export const Basic: Story = {
  render: () => (
    <ListContextProvider value={listContext}>
      <ProductList />
    </ListContextProvider>
  ),
};

export const WithFiltering: Story = {
  render: () => (
    <ListContextProvider value={listContext}>
      <Table title="Inventory Management" filtering preferences>
        <Column source="name" label="Product Name" />
        <Column source="category" label="Category" />
        <NumberColumn source="price" label="Price" />
        <NumberColumn source="stock" label="Inventory" />
      </Table>
    </ListContextProvider>
  ),
};
