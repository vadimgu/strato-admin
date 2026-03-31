---
sidebar_label: useStore
---

# `useStore`

A `useState`-like hook backed by `localStorage`. Allows UI state (e.g. sidebar collapsed, preferred view mode) to persist across page reloads. Keys are namespaced per user when an auth provider is present.

```tsx
import { useStore } from '@strato-admin/core';

const ViewToggle = () => {
  const [view, setView] = useStore('products.view', 'table');
  return (
    <button onClick={() => setView(view === 'table' ? 'cards' : 'table')}>
      Switch to {view === 'table' ? 'cards' : 'table'}
    </button>
  );
};
```

:::info React-Admin reference
This hook is provided by react-admin. See the full documentation at [marmelab.com/react-admin/useStore.html](https://marmelab.com/react-admin/useStore.html).
:::
