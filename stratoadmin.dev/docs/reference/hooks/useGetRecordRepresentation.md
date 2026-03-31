---
sidebar_label: useGetRecordRepresentation
---

# `useGetRecordRepresentation`

Returns a function that converts a record into a human-readable string. Used by reference fields and inputs to display related records. The representation is controlled by the `recordRepresentation` prop on `<Resource>` or `<ResourceSchema>`.

```tsx
import { useGetRecordRepresentation } from '@strato-admin/core';

const RecordLabel = ({ record }: { record: any }) => {
  const getRepresentation = useGetRecordRepresentation('products');
  return <span>{getRepresentation(record)}</span>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useGetRecordRepresentation.html](https://marmelab.com/react-admin/useGetRecordRepresentation.html).
:::
