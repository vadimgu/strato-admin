import { Edit, SimpleForm, TextInput, NumberInput, TextAreaInput } from 'strato-admin';

const required = (value: any) => (value ? undefined : 'Required');

export const ProductEdit = () => (
    <Edit title="Edit Product">
        <SimpleForm>
            <TextInput source="title" label="Title" validate={required} />
            <TextInput source="brand" label="Brand" />
            <NumberInput source="price" label="Price" validate={required} />
            <NumberInput source="discountPercentage" label="Discount %" />
            <NumberInput source="stock" label="Stock" />
            <TextAreaInput source="description" label="Description" />
        </SimpleForm>
    </Edit>
);

export default ProductEdit;
