import { List, Table } from 'strato-admin';

export const UserList = () => (
  <List>
    <Table header="Users" filtering preferences>
      <Table.Column source="firstName" label="First Name" sortable link="show" />
      <Table.Column source="lastName" label="Last Name" sortable />
      <Table.Column source="username" label="Username" sortable />
      <Table.Column source="email" label="Email" sortable />
      <Table.Column source="role" label="Role" sortable />
      <Table.NumberColumn source="age" label="Age" sortable />
    </Table>
  </List>
);

export default UserList;
