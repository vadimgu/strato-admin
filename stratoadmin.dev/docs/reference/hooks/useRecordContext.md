---
sidebar_label: useRecordContext
---

# `useRecordContext`

Returns the current record object from the nearest record context. Available inside field components, detail pages, edit pages, or any component wrapped with `<RecordContextProvider>`.

```tsx
import { useRecordContext } from '@strato-admin/core';

const ProductTitle = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <h1>{record.name}</h1>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useRecordContext.html](https://marmelab.com/react-admin/useRecordContext.html).
:::
