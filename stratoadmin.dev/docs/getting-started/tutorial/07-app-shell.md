# The App Shell & Branding

Our StratoShop admin is functional, but it still looks like a generic dashboard. In this chapter, we will customize the **App Shell** — the persistent outer frame of the application — to match our brand.

## Setting the Application Title

The simplest way to brand your app is to set a `title` on the `<Admin>` component. This string appears in the top navigation bar.

```tsx title="src/App.tsx"
const App = () => (
  <Admin dataProvider={dataProvider} title="StratoShop Admin">
    {/* ... */}
  </Admin>
);
```

## Customizing the Top Navigation

For more control over the header — such as adding a logo — you can render your own `<TopNavigation>` and pass it to `<AppLayout>` via the `header` prop.

Create a custom layout component in `src/Layout.tsx`:

```tsx title="src/Layout.tsx"
import { AppLayout, TopNavigation } from '@strato-admin/admin';

const logoUrl = '/logo.svg'; // place your logo in the public/ directory

const customHeader = (
  <TopNavigation
    identity={{
      title: 'StratoShop',
      href: '/',
      logo: { src: logoUrl, alt: 'StratoShop logo' },
    }}
  />
);

export const Layout = (props: any) => <AppLayout {...props} header={customHeader} />;
```

Then wire it into `<Admin>`:

```tsx title="src/App.tsx"
import { Layout } from './Layout';

const App = () => (
  <Admin dataProvider={dataProvider} layout={Layout}>
    {/* ... */}
  </Admin>
);
```

## How it Works

- **`layout` prop:** `<Admin>` accepts a `layout` component that replaces the default `AppLayout`. You receive all framework props automatically and spread them with `{...props}`.
- **`header` prop:** `<AppLayout>` renders a `<TopNavigation>` by default. Passing your own `header` element overrides it entirely.
- **Automatic utilities:** The `<TopNavigation>` component automatically adds a theme toggle button, a locale switcher (when multiple locales are configured), and a user menu (when an auth provider is present). These appear unless you supply a custom `utilities` array.

## Light & Dark Mode

Light/dark mode switching is built in. The theme toggle button in the top navigation bar applies the Cloudscape `light` or `dark` visual mode globally. No extra setup is required — the user's preference is persisted in `localStorage` across sessions.

If you want to force a specific mode as the default, you can initialize the store value in your app:

:::tip Custom brand colors
Want to apply your brand's colors? See [Theming](/docs/core-concepts/theming) for how to override Cloudscape design tokens.
:::

```tsx title="src/App.tsx"
import { localStorageStore } from '@strato-admin/admin';

// Pre-set the theme to dark mode
const store = localStorageStore();
store.setItem('theme', 'dark');

const App = () => (
  <Admin dataProvider={dataProvider} store={store}>
    {/* ... */}
  </Admin>
);
```

## Grouping Resources in the Sidebar

The sidebar navigation is generated automatically from the resources that have a `list` view. Resources appear in the order they are declared in `<Admin>`. To control the order, simply reorder your `<ResourceSchema>` declarations:

```tsx title="src/App.tsx"
const App = () => (
  <Admin dataProvider={dataProvider} title="StratoShop Admin">
    {/* Catalog group */}
    {productResource}
    {categoryResource}

    {/* Sales group */}
    {orderResource}
    {customerResource}
    {reviewResource}
  </Admin>
);
```

> **Tip:** Resources with `list={false}` (like a read-only `categories` reference resource) are automatically excluded from the sidebar menu.

## Summary

In this chapter, we've learned how to:

- Set the application title with the `title` prop on `<Admin>`.
- Provide a custom logo and header using `<TopNavigation>` and the `header` prop on `<AppLayout>`.
- Override the entire layout by passing a custom `layout` component to `<Admin>`.
- Control light/dark mode defaults.

## Next Steps

In the next chapter, we will add **Authentication** to secure the dashboard and implement role-based access control.
