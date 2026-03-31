---
sidebar_label: useLocale
---

# `useLocale`

Returns the currently active locale string (e.g. `"en"`, `"fr"`).

```tsx
import { useLocale } from '@strato-admin/core';

const LocaleIndicator = () => {
  const locale = useLocale();
  return <span>Current locale: {locale}</span>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useLocale.html](https://marmelab.com/react-admin/useLocale.html).
:::
