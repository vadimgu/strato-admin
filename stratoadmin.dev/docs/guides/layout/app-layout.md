---
sidebar_position: 5
title: 'App Layout'
---

# `<AppLayout>`

The `<AppLayout>` component defines the overall structure of a Strato Admin application. It wraps the AWS Cloudscape [`AppLayout`](https://cloudscape.design/components/app-layout) component and provides default implementations for navigation and headers.

It is used by default in the [`<Admin>`](../../core-concepts/admin.md) component.

## Usage

While you don't typically need to use `<AppLayout>` directly, you can provide it to the `<Admin>` component to customize its behavior.

```tsx
import { Admin, AppLayout } from '@strato-admin/admin';

const MyLayout = (props: any) => (
    <AppLayout {...props} title="My custom Title" />
);

const App = () => (
    <Admin layout={MyLayout} dataProvider={...}>
        {/* ... */}
    </Admin>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="AppLayout" />

### `children`

The content to be rendered in the main area. This is typically the current page.

### `header`

An optional custom header component. If not provided, it defaults to [`<TopNavigation>`](./top-navigation.md).

### `title`

An optional title for the application, displayed in the default [`<TopNavigation>`](./top-navigation.md).

## Automatic Navigation

`<AppLayout>` automatically generates the side navigation menu based on your [`<Resource>`](../../core-concepts/resource.md) definitions.

Each resource will have a link in the sidebar. The label for the link is determined as follows:

1.  The `label` option in the resource's `options` prop, translated if an internationalization provider is configured.
2.  A translation key `resource.[resourceName].name`.
3.  The resource name itself.

## Customizing the Header

The header is rendered above the main layout area. By default, it uses `<TopNavigation>`, which includes the application title, a locale switcher (if multiple locales are provided), and a user menu (if an authentication provider is configured).

You can override the header by providing a `header` prop:

```tsx
import { AppLayout, TopNavigation } from '@strato-admin/admin';

const CustomLayout = ({ children, title }: any) => {
  return (
    <AppLayout header={<TopNavigation identity={{ title: 'Custom Title', href: '/' }} />} title={title}>
      {children}
    </AppLayout>
  );
};
```
