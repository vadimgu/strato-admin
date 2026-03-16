import { Admin, ResourceSchema } from 'strato-admin';
import { icuI18nProvider } from 'strato-i18n';
import englishMessages from 'strato-language-en';
import frenchMessages from 'strato-language-fr';
import { dataProvider } from './dataProvider';
import { ProductList, ProductShow, ProductCreate, ProductEdit, productSchema, productInputSchema, productRepresentation } from './resources/products';
import { CategoryList, CategoryShow, categorySchema } from './resources/categories';
import { CustomerList, CustomerShow, customerSchema } from './resources/customers';
import { OrderList, OrderShow, orderSchema } from './resources/orders';
import { ReviewList, ReviewShow, reviewSchema } from './resources/reviews';

import enAppMessages from '../locales/en/messages.compiled.json';
import frAppMessages from '../locales/fr/messages.compiled.json';



// 3. Provide the locale and messages to I18nProvider when rendering:

const messages = {
  en: { ...englishMessages, ...enAppMessages },
  fr: { ...frenchMessages, ...frAppMessages },
};

const i18nProvider = icuI18nProvider(
  (locale) => messages[locale as keyof typeof messages],
  'en',
  [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
  ],
);

export default function App() {
  return (
    <Admin dataProvider={dataProvider} title="Strato E-commerce Demo" i18nProvider={i18nProvider}>
      <ResourceSchema
        label="Products"
        name="products"
        // list={ProductList}
        show={ProductShow}
        // create={ProductCreate}
        // edit={ProductEdit}
        recordRepresentation={productRepresentation}
        fieldSchema={productSchema}
        inputSchema={productInputSchema}
      />
      <ResourceSchema
        label="Categories"
        name="categories"
        canDelete={false}
        canList={true}
        canShowDetails={false}
        // list={CategoryList}
        // show={CategoryShow}
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

