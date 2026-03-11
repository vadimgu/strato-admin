import { Edit, SimpleForm, NumberInput, ArrayInput, SimpleFormIterator, ReferenceInput, AutocompleteInput } from 'strato-admin';

export const CartEdit = () => (
    <Edit title="Edit Cart" mutationMode="pessimistic">
        <SimpleForm>
            <ReferenceInput reference="users" source="userId">
                <AutocompleteInput label="User" source="userId" />
            </ReferenceInput>
            <ArrayInput source="products" label="Products">
                <SimpleFormIterator>
                    <NumberInput source="id" label="Product ID" />
                    <NumberInput source="quantity" label="Quantity" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export default CartEdit;
