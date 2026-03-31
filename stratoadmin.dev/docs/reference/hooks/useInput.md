---
sidebar_label: useInput
---

# `useInput`

The foundation for building custom form inputs. Connects a component to `react-hook-form`, handling registration, validation, and change/blur events. Returns field state and event handlers from `react-hook-form`.

```tsx
import { useInput } from '@strato-admin/core';

const MyTextInput = ({ source, label }: { source: string; label: string }) => {
  const { field, fieldState } = useInput({ source });
  return (
    <div>
      <label>{label}</label>
      <input {...field} />
      {fieldState.error && <span>{fieldState.error.message}</span>}
    </div>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useInput.html](https://marmelab.com/react-admin/useInput.html).
:::
