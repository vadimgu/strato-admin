---
sidebar_label: useResourceDefinition
---

# `useResourceDefinition`

Returns the definition object for a given resource (or the current resource from context), including its name, icon, `hasList`, `hasEdit`, `hasCreate`, and `hasShow` flags.

```tsx
import { useResourceDefinition } from '@strato-admin/core';

const ResourceIcon = ({ resource }: { resource: string }) => {
  const { icon: Icon } = useResourceDefinition({ resource });
  return Icon ? <Icon /> : null;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useResourceDefinition.html](https://marmelab.com/react-admin/useResourceDefinition.html).
:::
