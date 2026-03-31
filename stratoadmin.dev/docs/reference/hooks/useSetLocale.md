---
sidebar_label: useSetLocale
---

# `useSetLocale`

Returns a function that changes the active locale. Typically used in language-switcher components alongside [`useLocales`](./useLocales.md).

```tsx
import { useLocales, useSetLocale } from '@strato-admin/core';

const LanguageSwitcher = () => {
  const locales = useLocales();
  const setLocale = useSetLocale();
  return (
    <select onChange={(e) => setLocale(e.target.value)}>
      {locales?.map(({ locale, name }) => (
        <option key={locale} value={locale}>
          {name}
        </option>
      ))}
    </select>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useSetLocale.html](https://marmelab.com/react-admin/useSetLocale.html).
:::
