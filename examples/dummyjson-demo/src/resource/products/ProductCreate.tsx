import { Create, Form, TextInput, NumberInput, TextAreaInput } from 'strato-admin';

const required = (value: any) => (value ? undefined : 'Required');

export const ProductCreate = () => (
    <Create title="Create Product">
        <Form>
            <Form.Field source="title" label="Title" validate={required}>
                <TextInput />
            </Form.Field>
            <TextInput source="brand" label="Brand" />
            <NumberInput source="price" label="Price" validate={required} />
            <NumberInput source="discountPercentage" label="Discount %" />
            <NumberInput source="stock" label="Stock" />
            <TextAreaInput source="description" label="Description" />
        </Form>
    </Create>
);

export default ProductCreate;
