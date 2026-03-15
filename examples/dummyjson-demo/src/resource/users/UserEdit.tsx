import { Edit, Form, TextInput, NumberInput, SelectInput } from 'strato-admin';

const required = (value: any) => (value ? undefined : 'Required');

export const UserEdit = () => (
  <Edit title="Edit User">
    <Form>
      <Form.Field source="firstName" label="First Name" validate={required}>
        <TextInput />
      </Form.Field>
      <TextInput source="lastName" label="Last Name" validate={required} />
      <TextInput source="username" label="Username" validate={required} />
      <TextInput source="email" label="Email" validate={required} />
      <NumberInput source="age" label="Age" />
      <Form.Field source="gender" label="Gender">
        <SelectInput
          choices={[
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
            { id: 'other', name: 'Other' },
          ]}
        />
      </Form.Field>
      <SelectInput
        source="role"
        label="Role"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'moderator', name: 'Moderator' },
          { id: 'user', name: 'User' },
        ]}
      />
      <TextInput source="phone" label="Phone" />
      <TextInput source="university" label="University" />
    </Form>
  </Edit>
);

export default UserEdit;
