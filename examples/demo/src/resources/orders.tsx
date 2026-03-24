import {
  ResourceSchema,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  StatusIndicatorField,
  ArrayField,
  ArrayInput,
} from '@strato-admin/admin';

interface Order {
  id: number;
  reference: string;
  date: string;
  customer_id: number;
  total: number;
  status: 'ordered' | 'delivered' | 'cancelled' | 'unknown';
  items: {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export const orderRepresentation = (record: any) => record.reference;

export const orderResource = (
  <ResourceSchema<Order>
    label="Orders"
    name="orders"
    recordRepresentation="reference"
  >
    <TextField source="id" label="ID" link="show" input={false} />
    <TextField source="reference" label="Reference" sortable />
    <DateField source="date" label="Date" input={false} sortable />
    <ReferenceField source="customer_id" reference="customers" label="Customer" link="show" />
    <NumberField source="total" label="Total" sortable options={{ style: 'currency', currency: 'USD' }} input={false} />
    <StatusIndicatorField source="status" label="Status" sortable>
      <StatusIndicatorField.Label value="ordered" type="info" label="Ordered" />
      <StatusIndicatorField.Label value="delivered" type="success" label="Delivered" />
      <StatusIndicatorField.Label value="cancelled" type="error" label="Cancelled" />
      <StatusIndicatorField.Label value="unknown" type="warning" label="Unknown" />
    </StatusIndicatorField>
    <ArrayField
      source="items"
      label="Items"
      isRequired
      input={<ArrayInput gridLayout={[{ rows: [[3, 1]] }]} />}
    >
      <ReferenceField source="product_id" reference="products" label="Product" isRequired />
      <NumberField source="quantity" label="Quantity" isRequired />
      <NumberField source="unit_price" label="Unit Price" options={{ style: 'currency', currency: 'USD' }} input={false} />
    </ArrayField>
  </ResourceSchema>
);
