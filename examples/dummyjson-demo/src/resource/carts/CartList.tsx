import { List, DataTable } from 'strato-admin';

export const CartList = () => (
  <List>
    <DataTable
      header="Carts"
      selectionType="multi"
      filtering
      preferences
    >
      <DataTable.Col source="id" label="ID" sortable link="show" />
      <DataTable.ReferenceCol source="userId" reference="users" label="User" sortable link="show" />
      <DataTable.NumberCol source="total" label="Total" sortable />
      <DataTable.NumberCol source="discountedTotal" label="Discounted Total" sortable />
      <DataTable.NumberCol source="totalProducts" label="Total Products" sortable />
      <DataTable.NumberCol source="totalQuantity" label="Total Quantity" sortable />
    </DataTable>
  </List>
);

export default CartList;
