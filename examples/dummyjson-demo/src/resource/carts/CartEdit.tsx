import { required, minValue } from 'ra-core';
import { Edit, SimpleForm, NumberInput, ArrayInput, SimpleFormIterator, ReferenceInput, AutocompleteInput, FormField } from 'strato-admin';

export const CartEdit = () => (
    <Edit title="Edit Cart" mutationMode="pessimistic">
        <SimpleForm>
            <FormField source="userId" label="User" validate={[required()]}>
                <ReferenceInput reference="users">
                    <AutocompleteInput />
                </ReferenceInput>
            </FormField>
            <FormField source="products" label="Products" validate={[required()]}>
                <ArrayInput>
                    <SimpleFormIterator>
                        <SimpleFormIterator.Item source="id" label="Product ID" validate={[required()]} >
                            <ReferenceInput reference="products">
                                <AutocompleteInput />
                            </ReferenceInput>
                        </SimpleFormIterator.Item>
                        <SimpleFormIterator.Item source="quantity" label="Quantity" field={NumberInput} validate={[required(), minValue(1)]} />
                    </SimpleFormIterator>
                </ArrayInput>
            </FormField>
        </SimpleForm>
    </Edit>
);

export default CartEdit;
