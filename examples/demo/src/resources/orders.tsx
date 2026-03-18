import {
  Table,
  List,
  FieldSchema,
  Show,
  KeyValuePairs,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  StatusIndicatorField,
} from '@strato-admin/admin';

export const orderSchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <TextField source="reference" label="Reference" sortable />
    <DateField source="date" label="Date" sortable />
    <ReferenceField source="customer_id" reference="customers" label="Customer" link="show" />
    <NumberField
      source="total"
      label="Total"
      sortable
      options={{ style: 'currency', currency: 'USD' }}
    />
    <StatusIndicatorField source="status" label="Status" sortable>
      <StatusIndicatorField.Label value="ordered" type="info" label="Ordered" />
      <StatusIndicatorField.Label value="delivered" type="success" label="Delivered" />
      <StatusIndicatorField.Label value="cancelled" type="error" label="Cancelled" />
      <StatusIndicatorField.Label value="unknown" type="warning" label="Unknown" />
    </StatusIndicatorField>
  </FieldSchema>
);

export function OrderList() {
  return (
    <List perPage={10}>
      <Table
        header="Orders"
        selectionType="multi"
        filtering
        filteringPlaceholder="Search orders..."
        preferences
      />
    </List>
  );
}

export function OrderShow() {
  return (
    <Show title="Order Details">
      <KeyValuePairs columns={3} />
    </Show>
  );
}
