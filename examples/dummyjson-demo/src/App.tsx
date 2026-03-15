import { Admin, Resource, Show, KeyValuePairs, TextField, NumberField } from 'strato-admin';
import dummyJsonDataProvider from './dummyJsonDataProvider';
import dummyJsonAuthProvider from './dummyJsonAuthProvider';
import { ProductList } from './resource/products/ProductList';
import { ProductShow } from './resource/products/ProductShow';
import { ProductEdit } from './resource/products/ProductEdit';
import { ProductCreate } from './resource/products/ProductCreate';
import { CategoryList } from './resource/products/CategoryList';
import { CartList } from './resource/carts/CartList';
import { CartShow } from './resource/carts/CartShow';
import { CartEdit } from './resource/carts/CartEdit';
import { CartCreate } from './resource/carts/CartCreate';
import { UserList } from './resource/users/UserList';
import { UserShow } from './resource/users/UserShow';
import { UserEdit } from './resource/users/UserEdit';
import { UserCreate } from './resource/users/UserCreate';

export default function App() {
  return (
    <Admin
      title="Strato Admin DummyJSON"
      dataProvider={dummyJsonDataProvider}
      // authProvider={dummyJsonAuthProvider}
    >
      <Resource
        options={{ label: 'Products' }}
        name="products"
        list={ProductList}
        show={ProductShow}
        edit={ProductEdit}
        create={ProductCreate}
        recordRepresentation={(record) => record.title}
      />
      <Resource
        options={{ label: 'Categories' }}
        name="products/categories"
        list={CategoryList}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        options={{ label: 'Carts' }}
        name="carts"
        list={CartList}
        show={CartShow}
        edit={CartEdit}
        create={CartCreate}
        recordRepresentation={(record) => `Cart #${record.id}`}
      />
      <Resource
        options={{ label: 'Users' }}
        name="users"
        list={UserList}
        show={UserShow}
        edit={UserEdit}
        create={UserCreate}
        recordRepresentation={(record) => `${record.firstName} ${record.lastName}`}
      />
    </Admin>
  );
}
