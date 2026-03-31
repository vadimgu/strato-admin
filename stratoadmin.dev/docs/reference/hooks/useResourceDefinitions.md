---
sidebar_label: useResourceDefinitions
---

# `useResourceDefinitions`

Returns a map of all registered resource definitions keyed by resource name. Useful for building navigation or introspective components that need to iterate over all resources.

```tsx
import { useResourceDefinitions } from '@strato-admin/core';

const ResourceList = () => {
  const resources = useResourceDefinitions();
  return (
    <ul>
      {Object.keys(resources).map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useResourceDefinitions.html](https://marmelab.com/react-admin/useResourceDefinitions.html).
:::
