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
      >
        <DataTable.Col source="id" label="ID" link="show" />
        <DataTable.Col source="name" label="Product Name" sortable />
        <DataTable.ReferenceCol source="categoryId" reference="categories" label="Category" link="show" />
        <DataTable.NumberCol source="price" label="Price" sortable>
          <NumberField options={{ style: 'currency', currency: 'USD' }} />
        </DataTable.NumberCol>
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
        <KeyValuePairs.Field source="id" label="ID" />
        <KeyValuePairs.Field source="name" label="Product Name" />
        <KeyValuePairs.Field source="categoryId" label="Category">
          <ReferenceField reference="categories" link="show" />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="price" label="Price">
          <NumberField options={{ style: 'currency', currency: 'USD' }} />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="stock" label="Stock">
          <NumberField />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="lastRestocked" label="Last Restocked">
          <DateField />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="isEcoFriendly" label="Eco-Friendly">
          <BooleanField showLabel />
        </KeyValuePairs.Field>
        <KeyValuePairs.Field source="description" label="Description" />
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
        <KeyValuePairs.Field source="id" label="ID" />
        <KeyValuePairs.Field source="name" label="Category Name" />
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
