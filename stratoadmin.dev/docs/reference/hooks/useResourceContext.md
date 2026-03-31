---
sidebar_label: useResourceContext
---

# `useResourceContext`

Returns the current resource name string from context. Useful for building components that adapt to whichever resource they're rendered inside.

```tsx
import { useResourceContext } from '@strato-admin/core';

const ResourceBadge = () => {
  const resource = useResourceContext();
  return <span>{resource}</span>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useResourceContext.html](https://marmelab.com/react-admin/useResourceContext.html).
:::
