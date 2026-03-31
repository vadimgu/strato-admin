---
sidebar_label: useTranslateLabel
---

# `useTranslateLabel`

Returns a function that translates a field or input label. First looks up `resources.{resource}.fields.{source}` in the i18n messages, then falls back to humanizing the `source` string. Used internally by all field and input components.

```tsx
import { useTranslateLabel } from '@strato-admin/core';

const FieldLabel = ({ source, resource }: { source: string; resource: string }) => {
  const translateLabel = useTranslateLabel();
  const label = translateLabel({ source, resource });
  return <label>{label}</label>;
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useTranslateLabel.html](https://marmelab.com/react-admin/useTranslateLabel.html).
:::
