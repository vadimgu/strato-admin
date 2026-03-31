---
sidebar_label: useCreatePath
---

# `useCreatePath`

Returns a function that generates URL paths for resource pages (list, detail, edit, create). Strato overrides the react-admin default with its own routing scheme:

| Page | Path |
|------|------|
| List | `/:resource` |
| Detail | `/:resource/:id` |
| Edit | `/:resource/:id/edit` |
| Create | `/:resource/create` |

```tsx
import { useCreatePath } from '@strato-admin/core';

const MyLink = ({ id }: { id: string }) => {
  const createPath = useCreatePath();
  const href = createPath({ resource: 'products', type: 'edit', id });
  return <a href={href}>Edit</a>;
};
```

:::note Strato override
`useCreatePath` is re-implemented in `@strato-admin/core` and does **not** use react-admin's default path structure (which uses `/show` instead of the Strato detail convention).
:::

:::info React-Admin reference
The original hook is documented at [marmelab.com/react-admin/useCreatePath.html](https://marmelab.com/react-admin/useCreatePath.html).
:::
