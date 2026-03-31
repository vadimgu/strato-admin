---
sidebar_label: useBulkDeleteController
---

# `useBulkDeleteController`

Provides the logic for bulk-deleting selected records in a list. Returns a handler that calls the data provider's `deleteMany` method for the currently selected record IDs.

```tsx
import { useBulkDeleteController } from '@strato-admin/core';

const BulkDeleteButton = () => {
  const { onClick, isPending } = useBulkDeleteController();
  return (
    <button onClick={onClick} disabled={isPending}>
      Delete selected
    </button>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useBulkDeleteController.html](https://marmelab.com/react-admin/useBulkDeleteController.html).
:::
