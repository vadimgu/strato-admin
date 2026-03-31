---
sidebar_label: useLocales
---

# `useLocales`

Returns the list of available locales as configured in `<Admin>`. Each entry contains a `locale` code and a `name` string suitable for display in a language switcher.

```tsx
import { useLocales } from '@strato-admin/core';

const LanguageSwitcher = () => {
  const locales = useLocales();
  return (
    <select>
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
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useLocales.html](https://marmelab.com/react-admin/useLocales.html).
:::
