import { DataTable, Admin, List, Resource } from 'strato-admin';
import { dataProvider } from './dataProvider';

function ProductList() {
  return (
    <List perPage={3}>
      <DataTable header="Products">
        <DataTable.Col source="id" label="ID" />
        <DataTable.Col source="name" label="Product Name" />
        <DataTable.ReferenceCol source="categoryId" reference="categories" label="Category" />
        <DataTable.NumberCol source="price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
        <DataTable.NumberCol source="stock" label="Stock" />
      </DataTable>
    </List>
  );
}

function CategoryList() {
  return (
    <List>
      <DataTable header="Categories">
        <DataTable.Col source="id" label="ID" />
        <DataTable.Col source="name" label="Category Name"/>
      </DataTable>
    </List>
  );
}

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource 
          name="products" 
          list={ProductList}
          recordRepresentation={(record) => record.name} 
      />
      <Resource 
          name="categories" 
          list={CategoryList}
          recordRepresentation={(record) => record.name}
      />
    </Admin>
  );
}
