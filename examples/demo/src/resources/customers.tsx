import {
  Table,
  List,
  FieldSchema,
  Show,
  KeyValuePairs,
  TextField,
  NumberField,
} from 'strato-admin';

export const customerSchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <TextField source="first_name" label="First Name" sortable />
    <TextField source="last_name" label="Last Name" sortable />
    <TextField source="email" label="Email" />
    <TextField source="city" label="City" sortable />
    <NumberField source="nb_commands" label="Orders" sortable />
    <NumberField
      source="total_spent"
      label="Total Spent"
      sortable
      options={{ style: 'currency', currency: 'USD' }}
    />
  </FieldSchema>
);

export function CustomerList() {
  return (
    <List perPage={10}>
      <Table
        header="Customers"
        selectionType="multi"
        filtering
        filteringPlaceholder="Search customers..."
        preferences
      />
    </List>
  );
}

export function CustomerShow() {
  return (
    <Show title="Customer Details">
      <KeyValuePairs columns={3} />
    </Show>
  );
}
