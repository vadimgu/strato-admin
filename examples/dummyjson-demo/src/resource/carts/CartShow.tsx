import { Show, KeyValuePairs, NumberField, DataTable, ArrayField, ReferenceField } from 'strato-admin';
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
                <DataTable variant="embedded" actions={null}>
                    <DataTable.Col source="title" label="Title" />
                    <DataTable.NumberCol source="price" label="Price">
                        <NumberField options={{ style: 'currency', currency: 'USD' }} />
                    </DataTable.NumberCol>
                    <DataTable.NumberCol source="quantity" label="Quantity">
                        <NumberField />
                    </DataTable.NumberCol>
                    <DataTable.NumberCol source="total" label="Total">
                        <NumberField options={{ style: 'currency', currency: 'USD' }} />
                    </DataTable.NumberCol>
                </DataTable>
            </ArrayField>
        </SpaceBetween>
    </Show>
);

export default CartShow;
