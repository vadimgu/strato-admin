import { Show, KeyValuePairs, TextField, NumberField, ReferenceField } from 'strato-admin';

export const ProductShow = () => (
  <Show title="Product Details">
    <KeyValuePairs columns={3}>
      <KeyValuePairs.Field source="id" label="ID" />
      <KeyValuePairs.Field source="title" label="Title" />
      <KeyValuePairs.Field source="brand" label="Brand" />
      <KeyValuePairs.Field source="category" label="Category">
        <ReferenceField reference="products/categories" link="show" />
      </KeyValuePairs.Field>
      <KeyValuePairs.Field source="price" label="Price">
        <NumberField options={{ style: 'currency', currency: 'USD' }} />
      </KeyValuePairs.Field>
      <KeyValuePairs.Field source="discountPercentage" label="Discount %" field={NumberField} />
      <KeyValuePairs.Field source="rating" label="Rating" field={NumberField} />
      <KeyValuePairs.Field source="stock" label="Stock" field={NumberField} />
    </KeyValuePairs>
    <KeyValuePairs columns={1}>
      <KeyValuePairs.Field label="Description" source="description" />
    </KeyValuePairs>
  </Show>
);

export default ProductShow;
