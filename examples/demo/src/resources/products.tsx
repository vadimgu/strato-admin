import {
  TextField,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  TextAreaInput,
  ResourceSchema,
} from '@strato-admin/admin';
import StarRatingField from '../components/StarRatingField';
import { RecordRepresentation } from '@strato-admin/ra-core';

export const productRepresentation = (record: any) => `${record.name} (${record.reference})`;

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
    detailTitle={<RecordRepresentation />}
    detailDescription="Product"
    editTitle="Edit Product - {name}"
    editDescription="Product"
    listExclude={['description', 'sales', 'category_id']}
    recordRepresentation="name"
  >
    <TextField source="id" label="ID" link="detail" input={false} />
    <TextField source="name" label="Name" sortable isRequired />
    <TextField source="reference" label="Reference" sortable isRequired />
    <ReferenceField source="category_id" reference="categories" label="Category" isRequired />
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
    <StarRatingField source="rating" label="Rating" sortable input={false} />
    <TextField source="description" label="Description" input={<TextAreaInput source="description" />} />
    <ReferenceManyField reference="reviews" target="product_id" sort={{ field: 'date', order: 'DESC' }} />
  </ResourceSchema>
);