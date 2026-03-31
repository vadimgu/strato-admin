---
sidebar_label: useDefaultTitle
---

# `useDefaultTitle`

Returns the application-level default title string passed to `<Admin title="...">`. Useful for building page titles that incorporate the app name.

```tsx
import { useDefaultTitle } from '@strato-admin/core';

const PageTitle = ({ page }: { page: string }) => {
  const appTitle = useDefaultTitle();
  return <title>{page} | {appTitle}</title>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useDefaultTitle.html](https://marmelab.com/react-admin/useDefaultTitle.html).
:::
