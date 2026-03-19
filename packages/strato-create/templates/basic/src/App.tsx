import { Admin, ResourceSchema, TextField, IdField } from '@strato-admin/admin';
import { dataProvider } from './dataProvider';

export const App = () => (
  <Admin dataProvider={dataProvider} title="My Strato Admin">
    <ResourceSchema name="products">
      <IdField source="id" />
      <TextField source="name" isRequired link="show" />
      <TextField source="description" />
    </ResourceSchema>
  </Admin>
);

export default App;
