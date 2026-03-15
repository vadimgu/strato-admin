import { List, Table } from 'strato-admin';

export const CartList = () => (
  <List>
    <Table header="Carts" selectionType="multi" filtering preferences>
      <Table.Column source="id" label="ID" sortable link="show" />
      <Table.ReferenceColumn source="userId" reference="users" label="User" sortable link="show" />
      <Table.NumberColumn source="total" label="Total" sortable />
      <Table.NumberColumn source="discountedTotal" label="Discounted Total" sortable />
      <Table.NumberColumn source="totalProducts" label="Total Products" sortable />
      <Table.NumberColumn source="totalQuantity" label="Total Quantity" sortable />
    </Table>
  </List>
);

export default CartList;
