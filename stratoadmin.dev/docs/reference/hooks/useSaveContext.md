---
sidebar_label: useSaveContext
---

# `useSaveContext`

Returns the save function and saving state from the nearest create or edit context. Use this to build custom save buttons or to trigger a save programmatically.

```tsx
import { useSaveContext } from '@strato-admin/core';

const AutoSaveIndicator = () => {
  const { saving } = useSaveContext();
  return saving ? <span>Saving…</span> : null;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useSaveContext.html](https://marmelab.com/react-admin/useSaveContext.html).
:::
