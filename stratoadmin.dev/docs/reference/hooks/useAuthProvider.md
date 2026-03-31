---
sidebar_label: useAuthProvider
---

# `useAuthProvider`

Returns the `authProvider` instance passed to `<Admin>`. Useful when you need to call auth methods directly (e.g. `checkAuth`, `getPermissions`) outside of the built-in controller hooks.

```tsx
import { useAuthProvider } from '@strato-admin/core';

const MyComponent = () => {
  const authProvider = useAuthProvider();
  // authProvider.checkAuth(), authProvider.getPermissions(), etc.
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useAuthProvider.html](https://marmelab.com/react-admin/useAuthProvider.html).
:::
