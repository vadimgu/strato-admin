import {
  DataTable,
  Admin,
  List,
  Resource,
  Show,
  KeyValuePairs,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  BooleanField,
} from 'strato-admin';
import { dataProvider } from './dataProvider';

function ProductList() {
  return (
    <List perPage={10}>
      <DataTable
        header="Products"
        selectionType="multi"
        filtering
        filteringPlaceholder="Search products..."
        preferences
        pageSizeOptions={[
          { value: 10, label: '10 Items' },
          { value: 20, label: '20 Items' },
          { value: 50, label: '50 Items' },
        ]}
      >
        <DataTable.Col source="id" label="ID" link="show" />
        <DataTable.Col source="name" label="Product Name" sortable />
        <DataTable.ReferenceCol source="categoryId" reference="categories" label="Category" link="show" />
        <DataTable.NumberCol source="price" label="Price" sortable options={{ style: 'currency', currency: 'USD' }} />
        <DataTable.NumberCol source="stock" label="Stock" sortable />
        <DataTable.DateCol source="lastRestocked" label="Last Restocked" sortable />
        <DataTable.BooleanCol source="isEcoFriendly" label="Eco-Friendly" />
      </DataTable>
    </List>
  );
}

function ProductShow() {
  return (
    <Show title="Product Details">
      <KeyValuePairs columns={3}>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Product Name" />
        <ReferenceField source="categoryId" reference="categories" label="Category" link="show" />
        <NumberField source="price" label="Price" options={{ style: 'currency', currency: 'USD' }} />
        <NumberField source="stock" label="Stock" />
        <DateField source="lastRestocked" label="Last Restocked" />
        <BooleanField source="isEcoFriendly" label="Eco-Friendly" showLabel />
        <TextField source="description" label="Description" />
      </KeyValuePairs>
    </Show>
  );
}

function CategoryList() {
  return (
    <List>
      <DataTable header="Categories" selectionType="multi">
        <DataTable.Col source="id" label="ID" link="show" />
        <DataTable.Col source="name" label="Category Name" link="show" />
      </DataTable>
    </List>
  );
}

function CategoryShow() {
  return (
    <Show title="Category Details">
      <KeyValuePairs columns={2}>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Category Name" />
      </KeyValuePairs>
    </Show>
  );
}

export default function App() {
  return (
    <Admin dataProvider={dataProvider} title="Strato Demo">
      <Resource
        options={{ label: 'Products' }}
        name="products"
        list={ProductList}
        show={ProductShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        options={{ label: 'Categories' }}
        name="categories"
        list={CategoryList}
        show={CategoryShow}
        recordRepresentation={(record) => record.name}
      />
    </Admin>
  );
}
