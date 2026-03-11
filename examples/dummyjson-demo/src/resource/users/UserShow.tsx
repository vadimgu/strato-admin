import { Show, KeyValuePairs, TextField, NumberField, DateField } from 'strato-admin';

export const UserShow = () => (
    <Show title="User Details">
        <KeyValuePairs columns={2}>
            <TextField source="id" label="ID" />
            <TextField source="username" label="Username" />
            <TextField source="firstName" label="First Name" />
            <TextField source="lastName" label="Last Name" />
            <TextField source="maidenName" label="Maiden Name" />
            <TextField source="email" label="Email" />
            <TextField source="phone" label="Phone" />
            <NumberField source="age" label="Age" />
            <TextField source="gender" label="Gender" />
            <TextField source="birthDate" label="Birth Date" />
            <TextField source="role" label="Role" />
            <TextField source="university" label="University" />
            <TextField source="company.name" label="Company" />
            <TextField source="company.title" label="Job Title" />
            <TextField source="company.department" label="Department" />
            <TextField source="address.address" label="Address" />
            <TextField source="address.city" label="City" />
            <TextField source="address.state" label="State" />
        </KeyValuePairs>
    </Show>
);

export default UserShow;
