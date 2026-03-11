import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, FormField } from 'strato-admin';

const required = (value: any) => (value ? undefined : 'Required');

export const UserEdit = () => (
    <Edit title="Edit User">
        <SimpleForm>
            <FormField source="firstName" label="First Name" validate={required}>
                <TextInput />
            </FormField>
            <TextInput source="lastName" label="Last Name" validate={required} />
            <TextInput source="username" label="Username" validate={required} />
            <TextInput source="email" label="Email" validate={required} />
            <NumberInput source="age" label="Age" />
            <FormField source="gender" label="Gender">
                <SelectInput choices={[
                    { id: 'male', name: 'Male' },
                    { id: 'female', name: 'Female' },
                    { id: 'other', name: 'Other' },
                ]} />
            </FormField>
            <SelectInput source="role" label="Role" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'moderator', name: 'Moderator' },
                { id: 'user', name: 'User' },
            ]} />
            <TextInput source="phone" label="Phone" />
            <TextInput source="university" label="University" />
        </SimpleForm>
    </Edit>
);

export default UserEdit;
