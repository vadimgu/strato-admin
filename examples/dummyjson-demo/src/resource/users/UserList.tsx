import { List, DataTable } from 'strato-admin';

export const UserList = () => (
    <List>
        <DataTable
            header="Users"
            filtering
            preferences
        >
            <DataTable.Col source="firstName" label="First Name" sortable link="show" />
            <DataTable.Col source="lastName" label="Last Name" sortable />
            <DataTable.Col source="username" label="Username" sortable />
            <DataTable.Col source="email" label="Email" sortable />
            <DataTable.Col source="role" label="Role" sortable />
            <DataTable.NumberCol source="age" label="Age" sortable />
        </DataTable>
    </List>
);

export default UserList;
