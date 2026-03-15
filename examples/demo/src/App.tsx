import { Admin, ResourceSchema } from 'strato-admin';
import { dataProvider } from './dataProvider';
import { ProductList, ProductShow, ProductCreate, ProductEdit, productSchema, productInputSchema, productRepresentation } from './resources/products';
import { CategoryList, CategoryShow, categorySchema } from './resources/categories';
import { CustomerList, CustomerShow, customerSchema } from './resources/customers';
import { OrderList, OrderShow, orderSchema } from './resources/orders';
import { ReviewList, ReviewShow, reviewSchema } from './resources/reviews';

export default function App() {
  return (
    <Admin dataProvider={dataProvider} title="Strato E-commerce Demo">
      <ResourceSchema
        label="Products"
        name="products"
        list={ProductList}
        show={ProductShow}
        create={ProductCreate}
        edit={ProductEdit}
        recordRepresentation={productRepresentation}
        fieldSchema={productSchema}
        inputSchema={productInputSchema}
      />
      <ResourceSchema
        label="Categories"
        name="categories"
        list={CategoryList}
        show={CategoryShow}
        recordRepresentation={(record) => record.name}
        fieldSchema={categorySchema}
      />
      <ResourceSchema
        label="Customers"
        name="customers"
        list={CustomerList}
        show={CustomerShow}
        recordRepresentation={(record) => `${record.first_name} ${record.last_name}`}
        fieldSchema={customerSchema}
      />
      <ResourceSchema
        label="Orders"
        name="orders"
        list={OrderList}
        show={OrderShow}
        recordRepresentation={(record) => record.reference}
        fieldSchema={orderSchema}
      />
      <ResourceSchema
        label="Reviews"
        name="reviews"
        list={ReviewList}
        show={ReviewShow}
        fieldSchema={reviewSchema}
      />
    </Admin>
  );
}
