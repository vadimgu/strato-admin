import { Create, SimpleForm, TextInput, NumberInput, SelectInput } from 'strato-admin';

const required = (value: any) => (value ? undefined : 'Required');

export const UserCreate = () => (
    <Create title="Create User">
        <SimpleForm>
            <TextInput source="firstName" label="First Name" validate={required} />
            <TextInput source="lastName" label="Last Name" validate={required} />
            <TextInput source="username" label="Username" validate={required} />
            <TextInput source="email" label="Email" validate={required} />
            <TextInput source="password" label="Password" validate={required} />
            <NumberInput source="age" label="Age" />
            <SelectInput source="gender" label="Gender" choices={[
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' },
                { id: 'other', name: 'Other' },
            ]} />
            <SelectInput source="role" label="Role" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'moderator', name: 'Moderator' },
                { id: 'user', name: 'User' },
            ]} defaultValue="user" />
        </SimpleForm>
    </Create>
);

export default UserCreate;
