import {
  Table,
  List,
  FieldSchema,
  InputSchema,
  Show,
  BadgeField,
  Create,
  Edit,
  KeyValuePairs,
  TextField,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextAreaInput,
} from 'strato-admin';
import StarRatingField from '../components/StarRatingField';

export const productSchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <TextField source="name" label="Name" sortable />
    <TextField source="reference" label="Reference" sortable />
    <ReferenceField source="category_id" reference="categories" label="Category" link={false}>
      <BadgeField source="name" />
    </ReferenceField>
    <NumberField source="price" label="Price" sortable options={{ style: 'currency', currency: 'USD' }} />
    <NumberField source="stock" label="Stock" sortable />
    <NumberField source="sales" label="Sales" sortable />
    <StarRatingField source="rating" label="Rating" sortable />
    <TextField source="description" label="Description" />
  </FieldSchema>
);

export const productRepresentation = (record: any) => `${record.name} (${record.reference})`;

export const productInputSchema = (
  <InputSchema>
    <TextInput source="name" label="Name" />
    <TextInput source="reference" label="Reference" />
    <ReferenceInput source="category_id" reference="categories" label="Category">
      <SelectInput source="category_id" />
    </ReferenceInput>
    <NumberInput source="price" label="Price" />
    <NumberInput source="stock" label="Stock" />
    <NumberInput source="sales" label="Sales" />
    <NumberInput source="rating" label="Rating" />
    <TextAreaInput source="description" label="Description" />
  </InputSchema>
);

export function ProductList() {
  return (
    <List perPage={10}>
      <Table
        header="Products"
        selectionType="multi"
        filteringPlaceholder="Search products..."
        exclude={['description']}
      />
    </List>
  );
}

export function ProductShow() {
  return (
    <Show title="Product Details">
      <KeyValuePairs columns={3} exclude={['description']} />
      <KeyValuePairs columns={1} include={['description']} />
      <ReferenceManyField reference="reviews" target="product_id" sort={{ field: 'date', order: 'DESC' }} >
        <Table exclude={['product_id']} />
      </ReferenceManyField>
    </Show>
  );
}




export function ProductCreate() {
  return <Create title="Create Product" exclude={['rating', 'sales']} />;
}

export function ProductEdit() {
  return <Edit title="Edit Product" />;
}
