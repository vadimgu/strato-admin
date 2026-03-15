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
} from 'strato-admin';

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
    <TextField source="status" label="Status" sortable />
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
