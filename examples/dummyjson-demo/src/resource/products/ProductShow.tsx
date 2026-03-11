import { Show, KeyValuePairs, TextField, NumberField, ReferenceField } from 'strato-admin';

export const ProductShow = () => (
    <Show title="Product Details">
        <KeyValuePairs columns={2}>
            <TextField source="id" label="ID" />
            <TextField source="title" label="Title" />
            <TextField source="brand" label="Brand" />
            <ReferenceField source="category" reference="products/categories" label="Category" link="show" />
            <NumberField source="price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
            <NumberField source="discountPercentage" label="Discount %" />
            <NumberField source="rating" label="Rating" />
            <NumberField source="stock" label="Stock" />
            <KeyValuePairs.Field label="Description" source="description" />
        </KeyValuePairs>
    </Show>
);

export default ProductShow;
