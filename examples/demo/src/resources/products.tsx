import {
  Table,
  Show,
  KeyValuePairs,
  TextField,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  TextAreaInput,
  ResourceSchema,
  SliderInput,
} from 'strato-admin';
import StarRatingField from '../components/StarRatingField';

export const productRepresentation = (record: any) => `${record.name} (${record.reference})`;

export const ProductResource = (
  <ResourceSchema
    name="products"
    label="Products"
    show={ProductShow}
    recordRepresentation={productRepresentation}
  >
    <TextField source="id" label="ID" link="show" input={false} />
    <TextField source="name" label="Name" sortable isRequired />
    <TextField source="reference" label="Reference" sortable isRequired />
    <ReferenceField
      source="category_id"
      reference="categories"
      label="Category"
      link={false}
      isRequired
    />
    <NumberField
      source="price"
      label="Price"
      sortable
      isRequired
      options={{ style: 'currency', currency: 'USD' }}
      description="Unit price including all taxes."
    />
    <NumberField source="stock" label="Stock" sortable />
    <NumberField source="sales" label="Sales" sortable />
    <StarRatingField
      source="rating"
      label="Rating"
      sortable
      input={<SliderInput source="rating" min={1} max={5} step={1} />} />
    <TextField
      source="description"
      label="Description"
      input={<TextAreaInput source="description" />}
    />
  </ResourceSchema>
);

// We provide a custom show view that is still relies on the schema-first
// approach.
export function ProductShow() {
  return (
    <Show title="Product Details">
      <KeyValuePairs columns={3} exclude={['description']} />
      <KeyValuePairs columns={1} include={['description']} />
      <ReferenceManyField
        reference="reviews"
        target="product_id"
        sort={{ field: 'date', order: 'DESC' }}
      >
        <Table exclude={['product_id']} title="Product Reviews" />
      </ReferenceManyField>
    </Show>
  );
}
