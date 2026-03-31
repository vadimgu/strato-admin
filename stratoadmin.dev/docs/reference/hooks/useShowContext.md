---
sidebar_label: useShowContext
---

# `useShowContext`

Returns the context provided by `<Detail>` (react-admin's `<Show>`), including the loaded record, resource name, and loading state. Available in any component rendered inside a detail page.

```tsx
import { useShowContext } from '@strato-admin/core';

const DetailSidebar = () => {
  const { record, isPending } = useShowContext();
  if (isPending) return <p>Loading…</p>;
  return <p>Viewing record #{record?.id}</p>;
};
```

:::note Strato terminology
Strato uses "detail" where react-admin uses "show". `useShowContext` is the underlying hook; in Strato it backs the `<Detail>` page.
:::

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useShowContext.html](https://marmelab.com/react-admin/useShowContext.html).
:::
