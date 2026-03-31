---
sidebar_label: useTranslate
---

# `useTranslate`

Returns a `translate(key, options?)` function for translating message keys using the active i18n provider. Strato uses ICU MessageFormat, so `options` can include named variables for interpolation.

```tsx
import { useTranslate } from '@strato-admin/core';

const WelcomeMessage = ({ name }: { name: string }) => {
  const translate = useTranslate();
  return <p>{translate('app.welcome', { name })}</p>;
};
```

:::note ICU MessageFormat
Strato uses ICU MessageFormat (not react-intl simple format). Translation messages support plurals, selects, and named variables. See the [Translation guide](../../core-concepts/translation.md) for details.
:::

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useTranslate.html](https://marmelab.com/react-admin/useTranslate.html).
:::
