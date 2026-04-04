---
sidebar_label: Theming
---

# Theming

Strato Admin is built on top of the [Cloudscape Design System](https://cloudscape.design/), so all visual theming — colors, typography, spacing — is handled by Cloudscape. This page explains the two theming layers available to you.

## Light & Dark Mode

A theme toggle is built in. It appears automatically in the top navigation bar and persists the user's choice in `localStorage` across sessions. No configuration is required.

### Forcing a default mode

By default the app starts in `light` mode. To change the default, initialize the store before rendering:

```tsx title="src/main.tsx"
import ReactDOM from 'react-dom/client';
import { localStorageStore } from '@strato-admin/admin';
import App from './App';

const store = localStorageStore();
// Only set the default if the user hasn't chosen yet
if (!store.getItem('theme')) {
  store.setItem('theme', 'dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

Pass the store to `<Admin>`:

```tsx title="src/App.tsx"
const App = () => (
  <Admin dataProvider={dataProvider} store={store}>
    {/* ... */}
  </Admin>
);
```

The allowed values are `'light'` and `'dark'`.

---

## Custom Brand Themes

Cloudscape exposes a `applyTheme()` function that lets you override individual design tokens — colors, border radii, spacing, typography — to match your brand. This is a separate step from light/dark mode: `applyTheme` sets the palette, `applyMode` (used internally by Strato Admin) switches between light and dark variants of that palette.

### Installation

The theming utilities live in a separate package that you install in your app:

```bash
npm install @cloudscape-design/theming
```

### Applying a theme

Call `applyTheme()` **before** mounting your React app so the CSS variables are in place before any component renders:

```tsx title="src/main.tsx"
import ReactDOM from 'react-dom/client';
import { applyTheme } from '@cloudscape-design/theming';
import App from './App';

applyTheme({
  theme: {
    tokens: {
      // Primary action color
      colorBackgroundButtonPrimaryDefault: '#FF6B00',
      colorBackgroundButtonPrimaryHover: '#E05A00',
      colorBackgroundButtonPrimaryActive: '#C44E00',
      colorTextButtonPrimaryDefault: '#FFFFFF',
      // Link color
      colorTextLinkDefault: '#FF6B00',
      colorTextLinkHover: '#E05A00',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### Mode-specific overrides

You can apply different token values for light and dark modes using the `modes` key:

```tsx
applyTheme({
  theme: {
    tokens: {
      // Base values (apply to both modes)
      colorBackgroundButtonPrimaryDefault: '#FF6B00',
    },
    modes: {
      dark: {
        // Values specific to dark mode
        colorBackgroundButtonPrimaryDefault: '#FF8C33',
      },
    },
  },
});
```

### Resetting a theme

To remove all custom token overrides and return to the Cloudscape defaults:

```tsx
import { resetTheme } from '@cloudscape-design/theming';

resetTheme();
```

---

## Design Tokens Reference

Cloudscape uses a structured naming convention for tokens:

| Prefix             | Covers                                                   |
| ------------------ | -------------------------------------------------------- |
| `colorBackground*` | Background fills (buttons, containers, inputs, overlays) |
| `colorText*`       | Text and icon colors                                     |
| `colorBorder*`     | Border and divider colors                                |
| `colorChart*`      | Data visualization colors                                |
| `space*`           | Spacing and layout gaps                                  |
| `borderRadius*`    | Corner radii                                             |
| `fontFamily*`      | Typeface stacks                                          |
| `fontSize*`        | Type scale                                               |
| `fontWeight*`      | Font weights                                             |
| `shadow*`          | Box shadows and elevation                                |

For the complete list of available tokens and their default values, see the [Cloudscape theming documentation](https://cloudscape.design/foundation/visual-foundation/design-tokens/).

---

## How It Works Internally

Strato Admin's `ThemeManager` component calls Cloudscape's `applyMode()` from `@cloudscape-design/global-styles` whenever the user switches modes. Your `applyTheme()` call sets the token palette; `applyMode()` selects which variant of that palette to display. The two calls are independent and compose correctly.
