import { ResourceSchema, TextField, NumberField, SelectInput } from '@strato-admin/admin';

const required = (value: any) => (value ? undefined : 'Required');

export const usersResource = (
  <ResourceSchema
    name="users"
    recordRepresentation={(record) => `${record.firstName} ${record.lastName}`}
    label="Users"
  >
    <TextField source="firstName" label="First Name" link="show" sortable input={{ constraints: [required] }} />
    <TextField source="lastName" label="Last Name" sortable input={{ constraints: [required] }} />
    <TextField source="username" label="Username" sortable input={{ constraints: [required] }} />
    <TextField source="email" label="Email" sortable input={{ constraints: [required] }} />
    <TextField
      source="role"
      label="Role"
      sortable
      input={
        <SelectInput
          source="role"
          choices={[
            { id: 'admin', name: 'Admin' },
            { id: 'moderator', name: 'Moderator' },
            { id: 'user', name: 'User' },
          ]}
        />
      }
    />
    <NumberField source="age" label="Age" sortable />
    <TextField
      source="gender"
      label="Gender"
      input={
        <SelectInput
          source="gender"
          choices={[
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
            { id: 'other', name: 'Other' },
          ]}
        />
      }
    />
    <TextField source="phone" label="Phone" />
    <TextField source="birthDate" label="Birth Date" />
    <TextField source="maidenName" label="Maiden Name" />
    <TextField source="university" label="University" />
    <TextField source="company.name" label="Company" />
    <TextField source="company.title" label="Job Title" />
    <TextField source="company.department" label="Department" />
    <TextField source="address.address" label="Address" />
    <TextField source="address.city" label="City" />
    <TextField source="address.state" label="State" />
  </ResourceSchema>
);
