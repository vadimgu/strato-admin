---
sidebar_label: useCreateContext
---

# `useCreateContext`

Returns the context provided by `<Create>`, including the current record, resource name, and the save function. Use this in custom components rendered inside a create page.

```tsx
import { useCreateContext } from '@strato-admin/core';

const MyCreateSidebar = () => {
  const { resource, record } = useCreateContext();
  return <p>Creating a new {resource}</p>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useCreateContext.html](https://marmelab.com/react-admin/useCreateContext.html).
:::
