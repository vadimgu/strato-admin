---
sidebar_label: useDeleteController
---

# `useDeleteController`

Provides the logic for deleting a single record. Returns a click handler that calls the data provider's `delete` method and handles optimistic updates, undo, and error notifications.

```tsx
import { useDeleteController } from '@strato-admin/core';

const DeleteButton = () => {
  const { onClick, isPending } = useDeleteController();
  return (
    <button onClick={onClick} disabled={isPending}>
      Delete
    </button>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useDeleteController.html](https://marmelab.com/react-admin/useDeleteController.html).
:::
