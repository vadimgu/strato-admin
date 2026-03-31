---
sidebar_label: useEditContext
---

# `useEditContext`

Returns the context provided by `<Edit>`, including the current record being edited, the resource name, and the save handler. Use this in custom components rendered inside an edit page.

```tsx
import { useEditContext } from '@strato-admin/core';

const EditSidebar = () => {
  const { record, resource, isPending } = useEditContext();
  return <p>Editing {resource} #{record?.id}</p>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useEditContext.html](https://marmelab.com/react-admin/useEditContext.html).
:::
