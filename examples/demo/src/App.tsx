import { Admin } from '@strato-admin/admin';
import { icuI18nProvider } from '@strato-admin/i18n';
import englishMessages from '@strato-admin/language-en';
import frenchMessages from '@strato-admin/language-fr';
import { dataProvider } from './dataProvider';
import { DemoLayout } from './DemoLayout';
import { productResource } from './resources/products';
import { categoryResource } from './resources/categories';
import { customerResource } from './resources/customers';
import { orderResource } from './resources/orders';
import { reviewResource } from './resources/reviews';

import enAppMessages from '../locales/en/messages.compiled.json';
import frAppMessages from '../locales/fr/messages.compiled.json';

// 3. Provide the locale and messages to I18nProvider when rendering:

const messages = {
  en: { ...englishMessages, ...enAppMessages },
  fr: { ...frenchMessages, ...frAppMessages },
};

const i18nProvider = icuI18nProvider((locale) => messages[locale as keyof typeof messages], 'en', [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
]);

export default function App() {
  return (
    <Admin dataProvider={dataProvider} title="Strato E-commerce Demo" i18nProvider={i18nProvider} layout={DemoLayout}>
      {productResource}
      {categoryResource}
      {customerResource}
      {orderResource}
      {reviewResource}
    </Admin>
  );
}
