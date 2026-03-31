# `<Admin>`

The root component of a Strato Admin application. It wires together the data provider, authentication, i18n, routing, and Cloudscape-themed layout.

## Usage

```tsx
import { Admin, ResourceSchema, TextField, IdField } from '@strato-admin/admin';
import { dataProvider } from './dataProvider';

export default function App() {
  return (
    <Admin dataProvider={dataProvider} title="My Admin">
      <ResourceSchema name="products">
        <IdField source="id" />
        <TextField source="name" isRequired link="detail" />
      </ResourceSchema>
    </Admin>
  );
}
```

## Props

| Prop               | Type                          | Default               | Description                                                                                                         |
| :----------------- | :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `dataProvider`     | `DataProvider`                |                       | **Required.** Communicates with your API.                                                                           |
| `children`         | `AdminChildren`               |                       | [`<ResourceSchema>`](./ResourceSchema.md) or [`<Resource>`](./resource.md) definitions, and other routes.           |
| `title`            | `string`                      |                       | Application title shown in the browser tab and sidebar header.                                                      |
| `authProvider`     | `AuthProvider`                |                       | Handles login, logout, permissions, and identity.                                                                   |
| `i18nProvider`     | `I18nProvider`                | English ICU           | Handles translations and locale switching.                                                                          |
| `store`            | `Store`                       | `localStorageStore()` | Persists user preferences (sidebar state, column widths, etc.).                                                     |
| `layout`           | `LayoutComponent`             | `<AppLayout>`         | Top-level layout wrapper.                                                                                           |
| `ready`            | `ComponentType`               | `<Ready>`             | Shown when the app has no resources defined yet.                                                                    |
| `dashboard`        | `DashboardComponent`          |                       | Component rendered at the root `/` route.                                                                           |
| `loginPage`        | `LoginComponent \| boolean`   |                       | Custom login page. Pass `false` to disable.                                                                         |
| `catchAll`         | `CatchAllComponent`           |                       | Rendered for unmatched routes (404).                                                                                |
| `error`            | `ErrorComponent`              |                       | Global error boundary component.                                                                                    |
| `requireAuth`      | `boolean`                     | `false`               | When `true`, all routes require authentication.                                                                     |
| `disableTelemetry` | `boolean`                     | `false`               | Opt out of anonymous usage telemetry.                                                                               |
| `basename`         | `string`                      |                       | URL base path when the app is not served from `/`.                                                                  |
| `routerProvider`   | `RouterProvider`              | react-router-dom      | Custom router implementation.                                                                                       |
| `queryClient`      | `QueryClient`                 |                       | Custom React Query client configuration.                                                                            |
| `settings`         | `ReactElement<AdminSettings>` |                       | Admin-level defaults (list/detail components, notification messages). Pass a [`<Settings>`](./Settings.md) element. |

---

## `dataProvider`

**Required.** An object with methods (`getList`, `getOne`, `create`, `update`, `delete`, etc.) used to communicate with your API.

```tsx
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

<Admin dataProvider={dataProvider}>{/* ... */}</Admin>;
```

See the [Data Providers](../core-concepts/data-providers.md) guide for details on implementing a custom data provider.

## `authProvider`

An object with methods to handle authentication. When provided, Strato Admin will redirect unauthenticated users to the login page.

```tsx
const authProvider = {
  login: ({ username, password }) => {
    /* ... */
  },
  logout: () => {
    /* ... */
  },
  checkAuth: () => {
    /* ... */
  },
  checkError: (error) => {
    /* ... */
  },
  getPermissions: () => {
    /* ... */
  },
};

<Admin dataProvider={dataProvider} authProvider={authProvider}>
  {/* ... */}
</Admin>;
```

See the [Auth Providers](../core-concepts/auth-providers.md) guide for details.

## `title`

The application title, displayed in the browser tab and in the sidebar header.

```tsx
<Admin dataProvider={dataProvider} title="Acme Admin">
  {/* ... */}
</Admin>
```

## `i18nProvider`

The internationalization provider. Strato Admin defaults to English using ICU MessageFormat. To add more locales, use `icuI18nProvider` from `@strato-admin/i18n`:

```tsx
import { icuI18nProvider } from '@strato-admin/i18n';
import englishMessages from '@strato-admin/language-en';
import frenchMessages from '@strato-admin/language-fr';

const messages = {
  en: { ...englishMessages, ...myEnMessages },
  fr: { ...frenchMessages, ...myFrMessages },
};

const i18nProvider = icuI18nProvider((locale) => messages[locale], 'en', [
  { locale: 'en', name: 'English' },
  { locale: 'fr', name: 'Français' },
]);

<Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
  {/* ... */}
</Admin>;
```

See the [Translations](../core-concepts/translation.md) guide for details.

## `store`

Controls how user preferences (sidebar state, table column widths, etc.) are persisted. Defaults to `localStorageStore()`.

```tsx
import { memoryStore } from '@strato-admin/admin';

// Use memory store (preferences reset on page reload — useful for tests)
<Admin dataProvider={dataProvider} store={memoryStore()}>
  {/* ... */}
</Admin>;
```

## `dashboard`

A React component to render at the root `/` route. Without a dashboard, navigating to `/` redirects to the first resource's list.

```tsx
const Dashboard = () => (
  <div>
    <h1>Welcome</h1>
  </div>
);

<Admin dataProvider={dataProvider} dashboard={Dashboard}>
  {/* ... */}
</Admin>;
```

## `layout`

TODO: document layout prop and link to `<AppLayout>` guide

```tsx
import { AppLayout } from '@strato-admin/admin';

const MyLayout = (props) => <AppLayout {...props} navigationWidth={300} />;

<Admin dataProvider={dataProvider} layout={MyLayout}>
  {/* ... */}
</Admin>;
```

## `loginPage`

Provide a custom login page component, or pass `false` to disable the login route entirely (useful when authentication is handled externally).

```tsx
<Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={MyLoginPage}>
  {/* ... */}
</Admin>
```

## `requireAuth`

When `true`, every route in the admin requires authentication. Unauthenticated users are redirected to the login page. Requires an `authProvider`.

```tsx
<Admin dataProvider={dataProvider} authProvider={authProvider} requireAuth>
  {/* ... */}
</Admin>
```

## `basename`

The URL base path when deploying the admin under a sub-path (e.g. `/admin`).

```tsx
<Admin dataProvider={dataProvider} basename="/admin">
  {/* ... */}
</Admin>
```

## `queryClient`

A custom React Query `QueryClient`. Use this to configure caching behavior, retry logic, or stale times globally.

```tsx
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  },
});

<Admin dataProvider={dataProvider} queryClient={queryClient}>
  {/* ... */}
</Admin>;
```

## `settings`

Pass a [`<Settings>`](./Settings.md) element to override Admin-level defaults such as the default list/detail components and notification messages for delete actions.

```tsx
import { Settings } from '@strato-admin/admin';

<Admin
  dataProvider={dataProvider}
  settings={<Settings listComponent={MyTable} detailComponent={MyDetailHub} deleteSuccessMessage="Item removed" />}
>
  {/* ... */}
</Admin>;
```

See [`<Settings>`](./Settings.md) for the full list of configurable values.
