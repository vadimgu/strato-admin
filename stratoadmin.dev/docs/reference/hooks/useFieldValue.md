---
sidebar_label: useFieldValue
---

# `useFieldValue`

Reads a single field's value from the current record context. Accepts a `source` path and returns the resolved value, supporting dot-notation for nested properties.

```tsx
import { useFieldValue } from '@strato-admin/core';

const PriceDisplay = () => {
  const price = useFieldValue({ source: 'pricing.amount' });
  return <span>${price}</span>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useFieldValue.html](https://marmelab.com/react-admin/useFieldValue.html).
:::
