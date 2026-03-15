import { Show, KeyValuePairs, NumberField, Table, ArrayField, ReferenceField } from 'strato-admin';
import SpaceBetween from '@cloudscape-design/components/space-between';

export const CartShow = () => (
  <Show title="Cart Details">
    <SpaceBetween size="l">
      <KeyValuePairs columns={2}>
        <KeyValuePairs.Field source="id" label="ID" />
        <KeyValuePairs.Field source="userId" label="User">
          <ReferenceField reference="users" link="show" />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="total" label="Total">
          <NumberField options={{ style: 'currency', currency: 'USD' }} />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="discountedTotal" label="Discounted Total">
          <NumberField options={{ style: 'currency', currency: 'USD' }} />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="totalProducts" label="Total Products">
          <NumberField />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="totalQuantity" label="Total Quantity">
          <NumberField />
        </KeyValuePairs.Field>
      </KeyValuePairs>
      <ArrayField source="products" resource="products">
        <Table variant="embedded" actions={null}>
          <Table.Column source="title" label="Title" />
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

export default CartShow;
