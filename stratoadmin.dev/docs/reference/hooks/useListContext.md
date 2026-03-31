---
sidebar_label: useListContext
---

# `useListContext`

Returns the full list page context: fetched data, pagination state, sort, filters, selected IDs, and callbacks to update them. Available inside any component rendered within a `<List>`.

```tsx
import { useListContext } from '@strato-admin/core';

const RecordCount = () => {
  const { total, isPending } = useListContext();
  if (isPending) return null;
  return <span>{total} records</span>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useListContext.html](https://marmelab.com/react-admin/useListContext.html).
:::
