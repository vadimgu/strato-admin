---
sidebar_label: useGetResourceLabel
---

# `useGetResourceLabel`

Returns a function that produces a translated label for a resource — either singular or plural. Looks up the i18n translation key `resources.{resource}.name` and falls back to humanizing the resource name.

```tsx
import { useGetResourceLabel } from '@strato-admin/core';

const ResourceHeading = ({ resource }: { resource: string }) => {
  const getLabel = useGetResourceLabel();
  return <h1>{getLabel(resource, 2)}</h1>; // plural form
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useGetResourceLabel.html](https://marmelab.com/react-admin/useGetResourceLabel.html).
:::
