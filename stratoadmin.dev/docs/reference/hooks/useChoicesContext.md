---
sidebar_label: useChoicesContext
---

# `useChoicesContext`

Reads choices data from the nearest choices context, typically provided by a `<ReferenceInput>`. Used internally by select and autocomplete inputs to access available options, loading state, and pagination controls.

```tsx
import { useChoicesContext } from '@strato-admin/core';

const MySelectInput = () => {
  const { allChoices, isPending, setFilters } = useChoicesContext();
  // render a custom select using allChoices
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useChoicesContext.html](https://marmelab.com/react-admin/useChoicesContext.html).
:::
