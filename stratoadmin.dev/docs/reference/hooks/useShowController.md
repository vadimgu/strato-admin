---
sidebar_label: useShowController
---

# `useShowController`

Fetches a single record by ID and returns the full controller state (record, loading, error, refetch). Used internally by `<Detail>` to load its data. Call this directly only if you are building a fully custom detail page outside of `<Detail>`.

```tsx
import { useShowController } from '@strato-admin/core';

const CustomDetailPage = ({ id }: { id: string }) => {
  const { record, isPending, error } = useShowController({ id });
  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Error</p>;
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
};
```

:::note Strato terminology
Strato uses "detail" where react-admin uses "show". `useShowController` backs the `<Detail>` page.
:::

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useShowController.html](https://marmelab.com/react-admin/useShowController.html).
:::
