import { Admin } from '@strato-admin/admin';
import dummyJsonDataProvider from './dummyJsonDataProvider';
// import dummyJsonAuthProvider from './dummyJsonAuthProvider';
import { productsResource, categoriesResource } from './resource/Products';
import { cartsResource } from './resource/Carts';
import { usersResource } from './resource/Users';

export default function App() {
  return (
    <Admin
      title="Strato Admin DummyJSON"
      dataProvider={dummyJsonDataProvider}
      // authProvider={dummyJsonAuthProvider}
    >
      {productsResource}
      {categoriesResource}
      {cartsResource}
      {usersResource}
    </Admin>
  );
}
