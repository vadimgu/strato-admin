import { Create, SimpleForm, NumberInput, ArrayInput, SimpleFormIterator, AutocompleteInput, ReferenceInput } from 'strato-admin';
import { required, minValue, minLength } from 'ra-core';

export const CartCreate = () => (
    <Create title="Add Cart">
        <SimpleForm>
            <ReferenceInput reference="users" source="userId">
                <AutocompleteInput label="User" source="userId" validate={required()} />
            </ReferenceInput>
            <ArrayInput source="products" label="Products" validate={[required(), minLength(2)]}>
                <SimpleFormIterator>
                    <ReferenceInput reference="products" source="id">
                        <AutocompleteInput label="Product" source="id" validate={[required(), minValue(1)]} />
                    </ReferenceInput>
                    <NumberInput source="quantity" label="Quantity" validate={[required(), minValue(1)]} />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);

export default CartCreate;
