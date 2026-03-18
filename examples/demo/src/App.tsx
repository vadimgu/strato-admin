import { Admin, ResourceSchema } from '@strato-admin/admin';
import { icuI18nProvider } from '@strato-admin/i18n';
import englishMessages from '@strato-admin/language-en';
import frenchMessages from '@strato-admin/language-fr';
import { dataProvider } from './dataProvider';
import { ProductResource } from './resources/products';
import { categorySchema } from './resources/categories';
import { CustomerList, CustomerShow, customerSchema } from './resources/customers';
import { OrderList, OrderShow, orderSchema } from './resources/orders';
import { reviewSchema } from './resources/reviews';

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
      {ProductResource}
      <ResourceSchema
        label="Categories"
        name="categories"
        canDelete={false}
        canList={true}
        canShowDetails={false}
        // list={CategoryList}
        // show={CategoryShow}
        recordRepresentation={(record) => record.name}
      >
        {categorySchema}
      </ResourceSchema>
      <ResourceSchema
        label="Customers"
        name="customers"
        list={CustomerList}
        show={CustomerShow}
        recordRepresentation={(record) => `${record.first_name} ${record.last_name}`}
      >
        {customerSchema}
      </ResourceSchema>
      <ResourceSchema
        label="Orders"
        name="orders"
        list={OrderList}
        show={OrderShow}
        recordRepresentation={(record) => record.reference}
      >
        {orderSchema}
      </ResourceSchema>
      <ResourceSchema name="reviews" label="Reviews" canDelete={false} canCreate={false}
      // list={ReviewList}
      // show={ReviewShow}
      >
        {reviewSchema}
      </ResourceSchema>
    </Admin>
  );
}

