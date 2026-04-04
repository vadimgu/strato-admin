import {
  TextField,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  TextAreaInput,
  ResourceSchema,
  Message,
  CurrencyField,
} from '@strato-admin/admin';
import StarRatingField from '../components/StarRatingField';
import { RecordRepresentation } from '@strato-admin/ra-core';

interface Product {
  id: number;
  name: string;
  reference: string;
  category_id: number;
  price: number;
  rating: number;
  stock: number;
  sales: number;
  description: string;
}

export const productResource = (
  <ResourceSchema<Product>
    name="products"
    label="Products"
    listTitle="Products"
    detailTitle={<RecordRepresentation />}
    detailDescription="Product"
    editTitle={(record) => (
      <Message vars={{ repr: <RecordRepresentation record={record} /> }}>{`Edit Product - {repr}`}</Message>
    )}
    editDescription="Edit Product"
    listExclude={['description']}
    recordRepresentation="name"
  >
    <TextField source="id" label="ID" link="detail" input={false} />
    <TextField source="name" label="Name" sortable isRequired />
    <ReferenceField source="category_id" reference="categories" label="Category" isRequired />
    <CurrencyField
      source="price"
      label="Price"
      sortable
      isRequired
      currency="USD"
      description="Unit price including all taxes."
    />
    // Custom field that is not part of Strato Admin
    <StarRatingField source="rating" label="Rating" sortable input={false} />
    <TextField source="reference" label="Reference" sortable isRequired />
    <NumberField source="stock" label="Stock" sortable />
    <NumberField source="sales" label="Sales" sortable />
    <TextField source="description" label="Description" input={<TextAreaInput source="description" />} />
    <ReferenceManyField reference="reviews" target="product_id" sort={{ field: 'date', order: 'DESC' }} />
  </ResourceSchema>
);
