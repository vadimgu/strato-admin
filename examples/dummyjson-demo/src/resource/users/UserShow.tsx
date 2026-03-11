import { Show, KeyValuePairs, NumberField } from 'strato-admin';

export const UserShow = () => (
    <Show title="User Details">
        <KeyValuePairs columns={2}>
            <KeyValuePairs.Field source="id" label="ID" />
            <KeyValuePairs.Field source="username" label="Username" />
            <KeyValuePairs.Field source="firstName" label="First Name" />
            <KeyValuePairs.Field source="lastName" label="Last Name" />
            <KeyValuePairs.Field source="maidenName" label="Maiden Name" />
            <KeyValuePairs.Field source="email" label="Email" />
            <KeyValuePairs.Field source="phone" label="Phone" />
            <KeyValuePairs.Field source="age" label="Age">
                <NumberField />
            </KeyValuePairs.Field>
            <KeyValuePairs.Field source="gender" label="Gender" />
            <KeyValuePairs.Field source="birthDate" label="Birth Date" />
            <KeyValuePairs.Field source="role" label="Role" />
            <KeyValuePairs.Field source="university" label="University" />
            <KeyValuePairs.Field source="company.name" label="Company" />
            <KeyValuePairs.Field source="company.title" label="Job Title" />
            <KeyValuePairs.Field source="company.department" label="Department" />
            <KeyValuePairs.Field source="address.address" label="Address" />
            <KeyValuePairs.Field source="address.city" label="City" />
            <KeyValuePairs.Field source="address.state" label="State" />
        </KeyValuePairs>
    </Show>
);

export default UserShow;
