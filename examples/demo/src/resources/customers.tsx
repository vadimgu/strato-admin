import {
  ResourceSchema,
  TextField,
  NumberField,
  ReferenceManyField,
} from '@strato-admin/admin';

export const customerRepresentation = (record: any) => `${record.first_name} ${record.last_name}`;

export const customerResource = (
  <ResourceSchema
    label="Customers"
    name="customers"
    detailTitle={(record) => `${record.first_name} ${record.last_name}`}
    detailDescription="Customer"
    recordRepresentation={customerRepresentation}
  >
    <TextField source="id" label="ID" link="show" />
    <TextField source="first_name" label="First Name" sortable />
    <TextField source="last_name" label="Last Name" sortable />
    <TextField source="email" label="Email" />
    <TextField source="city" label="City" sortable />
    <NumberField source="nb_commands" label="Orders" sortable />
    <NumberField source="total_spent" label="Total Spent" sortable options={{ style: 'currency', currency: 'USD' }} />
    <ReferenceManyField reference="orders" target="customer_id" sort={{ field: 'date', order: 'DESC' }} exclude={["customer_id"]} />
  </ResourceSchema>
);

