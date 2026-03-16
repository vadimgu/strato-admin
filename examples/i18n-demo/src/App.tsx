import { Admin, Resource, List, Table } from 'strato-admin';
import { icuI18nProvider } from 'strato-i18n';
import fakeRestProvider from 'ra-data-fakerest';

const dataProvider = fakeRestProvider(
  {
    products: [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 },
    ],
  },
  true,
);

const messages: Record<string, any> = {
  en: {
    resources: {
      products: {
        name: 'Products',
        fields: {
          name: 'Name',
          price: 'Price',
        },
      },
    },
    pos: {
      search: 'Search',
      configuration: 'Configuration',
      language: 'Language',
      theme: 'Theme',
      stock: 'Stock',
    },
  },
  fr: {
    resources: {
      products: {
        name: 'Produits',
        fields: {
          name: 'Nom',
          price: 'Prix',
        },
      },
    },
    pos: {
      search: 'Rechercher',
      configuration: 'Configuration',
      language: 'Langue',
      theme: 'Thème',
      stock: 'Stock',
    },
  },
  egy: {
    resources: {
      products: {
        name: '𓐍𓏏𓏛',
        fields: {
          name: '𓂋𓈖',
          price: '𓋴𓍑𓄿𓏛',
        },
      },
    },
    pos: {
      search: '𓅱𓐍𓇋𓇋',
      configuration: '𓊔𓏏𓏛',
      language: '𓌃𓂓𓏏',
      theme: '𓊗',
      stock: '𓇗',
    },
  },
};

const i18nProvider = icuI18nProvider((locale) => messages[locale], 'en', [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
  { locale: 'egy', name: '𓂋𓈖𓆎𓅓𓏏𓊖' },
]);

const ProductList = () => (
  <List>
    <Table>
      <Table.Col source="name" />
      <Table.NumberCol source="price" options={{ style: 'currency', currency: 'USD' }} />
    </Table>
  </List>
);

const App = () => (
  <Admin dataProvider={dataProvider} i18nProvider={i18nProvider} title="I18n Demo">
    <Resource name="products" list={ProductList} />
  </Admin>
);

export default App;
