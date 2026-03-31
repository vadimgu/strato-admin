import {
  ResourceSchema,
  TextField,
  NumberField,
  ReferenceField,
  ArrayField,
  Table,
  Show,
  KeyValuePairs,
  SpaceBetween,
} from '@strato-admin/admin';

const required = (value: any) => (value ? undefined : 'Required');

const CartShow = () => (
  <Show title="Cart Details">
    <SpaceBetween size="l">
      <KeyValuePairs columns={3}>
        <TextField source="id" label="ID" />
        <ReferenceField source="userId" reference="users" label="User" link="detail" />
        <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'USD' }} />
        <NumberField
          source="discountedTotal"
          label="Discounted Total"
          options={{ style: 'currency', currency: 'USD' }}
        />
        <NumberField source="totalProducts" label="Total Products" />
        <NumberField source="totalQuantity" label="Total Quantity" />
      </KeyValuePairs>

      <ArrayField source="products">
        <Table header="Products">
          <Table.Column source="title" label="Product" />
          <Table.NumberColumn source="price" label="Price">
            <NumberField options={{ style: 'currency', currency: 'USD' }} />
          </Table.NumberColumn>
          <Table.NumberColumn source="quantity" label="Quantity">
            <NumberField />
          </Table.NumberColumn>
          <Table.NumberColumn source="total" label="Total">
            <NumberField options={{ style: 'currency', currency: 'USD' }} />
          </Table.NumberColumn>
        </Table>
      </ArrayField>
    </SpaceBetween>
  </Show>
);

export const cartsResource = (
  <ResourceSchema name="carts" recordRepresentation={(record) => `Cart #${record.id}`} label="Carts" detail={CartShow}>
    <TextField source="id" label="ID" link="detail" sortable />
    <ReferenceField
      source="userId"
      reference="users"
      label="User"
      link="detail"
      sortable
      input={{ constraints: [required] }}
    />
    <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'USD' }} sortable />
    <NumberField
      source="discountedTotal"
      label="Discounted Total"
      options={{ style: 'currency', currency: 'USD' }}
      sortable
    />
    <NumberField source="totalProducts" label="Total Products" sortable />
    <NumberField source="totalQuantity" label="Total Quantity" sortable />
  </ResourceSchema>
);
