---
sidebar_label: useSettings
---

# `useSettings`

Returns the current Admin-level settings. Values reflect the [`<Settings>`](../Settings.md) props passed to [`<Admin>`](../Admin.md), merged over the framework's built-in defaults.

```tsx
import { useSettings } from '@strato-admin/core';

const { listComponent, detailComponent, deleteSuccessMessage } = useSettings();
```

## Signature

```ts
function useSettings(): AdminSettings;
```

### `AdminSettings`

```ts
interface AdminSettings {
  listComponent?: ComponentType<any>;
  detailComponent?: ComponentType<any>;
  deleteSuccessMessage?: string | ReactNode;
  bulkDeleteSuccessMessage?: string | ReactNode | ((count: number) => ReactNode);
}
```

All fields are optional — the hook returns an empty object `{}` when called outside an `<Admin>` tree, and the full merged defaults when called inside one.

## Example

Render a custom action that uses the same list component as the rest of the app:

```tsx
import { useSettings } from '@strato-admin/core';

const ResourcePreview = ({ resource }: { resource: string }) => {
  const { listComponent: ListComponent } = useSettings();

  if (!ListComponent) return null;
  return <ListComponent resource={resource} />;
};
```

## Framework defaults

When no `<Settings>` prop is provided to `<Admin>`, the framework defaults apply:

| Setting | Default |
| :--- | :--- |
| `listComponent` | `<Table>` |
| `detailComponent` | `<DetailHub>` |
| `deleteSuccessMessage` | `"Element deleted"` |
| `bulkDeleteSuccessMessage` | `"{count} elements deleted"` (ICU plural) |

See [`<Settings>`](../Settings.md) for how to override these values.

## Building components that respect settings

When building a component that accepts a local prop but should fall back to the global setting, use [`useSettingValue`](./useSettingValue.md) instead of reading `useSettings` directly.
