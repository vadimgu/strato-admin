import { Show, KeyValuePairs, TextField, NumberField, DataTable, ArrayField, ReferenceField } from 'strato-admin';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

export const CartShow = () => (
    <Show title="Cart Details">
        <SpaceBetween size="l">
            <KeyValuePairs columns={2}>
                <TextField source="id" label="ID" />
                <ReferenceField source="userId" reference="users" label="User" link="show" />
                <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'USD' }} />
                <NumberField source="discountedTotal" label="Discounted Total" options={{ style: 'currency', currency: 'USD' }} />
                <NumberField source="totalProducts" label="Total Products" />
                <NumberField source="totalQuantity" label="Total Quantity" />
            </KeyValuePairs>
            <ArrayField source="products" resource="products">
                <DataTable variant="embedded" actions={null}>
                    <DataTable.Col source="title" label="Title" />
                    <DataTable.NumberCol source="price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
                    <DataTable.NumberCol source="quantity" label="Quantity" />
                    <DataTable.NumberCol source="total" label="Total" options={{ style: 'currency', currency: 'USD' }} />
                </DataTable>
            </ArrayField>
        </SpaceBetween>
    </Show>
);

export default CartShow;
