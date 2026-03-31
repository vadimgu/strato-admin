---
sidebar_position: 6
title: 'Top Navigation'
---

# `<TopNavigation>`

The `<TopNavigation>` component renders the horizontal navigation bar at the top of the application. It includes branding (the application title and logo), utility menus (such as the locale switcher and user menu), and search.

It is used as the default header for [`<AppLayout>`](./app-layout.md).

## Usage

```tsx
import { TopNavigation } from '@strato-admin/admin';

const MyHeader = () => (
  <TopNavigation
    identity={{ title: 'My Custom Title', href: '/' }}
    utilities={[{ type: 'button', text: 'Docs', href: 'https://docs.example.com' }]}
  />
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="TopNavigation" />

### `identity`

An object defining the application's branding:

- `title` (string): The application title.
- `href` (string): The link for the title and logo.
- `logo` (object): Optional logo configuration.

### `utilities`

An array of utility items to display in the header (e.g., user menu, settings, language switcher).
If not provided, it is automatically populated based on:

1.  Available locales (if an internationalization provider is configured).
2.  The current user's profile and a sign-out button (if an authentication provider is configured).

### `search`

An optional search component to render in the header.

## Automatic Utilities

`<TopNavigation>` automatically provides:

- **Locale Switcher**: If more than one locale is configured in the `i18nProvider`, a dropdown menu is displayed to switch between them.
- **User Menu**: If an `authProvider` is configured, a user profile icon and a sign-out button are displayed.
