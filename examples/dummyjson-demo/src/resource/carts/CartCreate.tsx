import { Create, SimpleForm, NumberInput, ArrayInput, SimpleFormIterator, AutocompleteInput, ReferenceInput, FormField } from 'strato-admin';
import { required, minValue, minLength } from 'ra-core';

export const CartCreate = () => (
    <Create title="Add Cart">
        <SimpleForm>
            <FormField source="userId" label="User" validate={required()}>
                <ReferenceInput reference="users">
                    <AutocompleteInput />
                </ReferenceInput>
            </FormField>
            <FormField source="products" label="Products" validate={[required(), minLength(2)]}>
                <ArrayInput>
                    <SimpleFormIterator>
                        <SimpleFormIterator.Item source="id" label="Product" validate={[required(), minValue(1)]}>
                            <ReferenceInput reference="products">
                                <AutocompleteInput />
                            </ReferenceInput>
                        </SimpleFormIterator.Item>
                        <SimpleFormIterator.Item source="quantity" label="Quantity" field={NumberInput} validate={[required(), minValue(1)]} />
                    </SimpleFormIterator>
                </ArrayInput>
            </FormField>
        </SimpleForm>
    </Create>
);

export default CartCreate;
