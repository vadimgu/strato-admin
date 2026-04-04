---
sidebar_label: useBulkDeleteMeta
---

# `useBulkDeleteMeta`

Resolves the confirmation dialog title, description, success message, and mutation mode for bulk delete operations. It applies ICU plural formatting based on the number of selected records. Use this inside a component rendered within a `<List>` context.

```tsx
import { useBulkDeleteMeta } from '@strato-admin/core';

const MyBulkDeleteButton = ({ dialogTitle, dialogDescription }) => {
  const { title, description } = useBulkDeleteMeta({
    title: dialogTitle,
    description: dialogDescription,
  });
  // title and description are already translated strings
};
```

## Signature

```ts
function useBulkDeleteMeta(props?: UseBulkDeleteMetaProps): {
  title: string;
  description: string;
  successMessage: string | ReactNode | ((count: number) => ReactNode) | undefined;
  mutationMode: 'pessimistic' | 'optimistic' | 'undoable' | undefined;
};

interface UseBulkDeleteMetaProps {
  title?: string;
  description?: string;
  successMessage?: string | ReactNode;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value:

1. The prop passed directly to the hook
2. The schema value from `<ResourceSchema>` (`bulkDeleteTitle` / `bulkDeleteDescription`)
3. The built-in default translation key (`strato.message.bulk_delete_title` / `strato.message.bulk_delete_content`)

All values are treated as ICU translation keys and formatted with `smart_count` equal to the number of currently selected records. This enables correct singular/plural output — for example, `"Delete this item"` vs `"Delete these 3 items"`.

For `successMessage` and `mutationMode`, the hook falls back to the [`<Settings>`](../Settings.md) values.

:::note Prop types are strings
Unlike the page-level meta hooks, `title` and `description` props are plain `string` (translation keys), not `ReactNode`. The hook always returns fully resolved `string` values.
:::

## Parameters

| Name                   | Type                                          | Description                                    |
| :--------------------- | :-------------------------------------------- | :--------------------------------------------- |
| `props.title`          | `string`                                      | Translation key override for the dialog title. |
| `props.description`    | `string`                                      | Translation key override for the dialog body.  |
| `props.successMessage` | `string \| ReactNode`                         | Notification shown after successful deletion.  |
| `props.mutationMode`   | `'pessimistic' \| 'optimistic' \| 'undoable'` | How the delete mutation behaves.               |

## Return value

| Field            | Type                                                                 | Description                           |
| :--------------- | :------------------------------------------------------------------- | :------------------------------------ |
| `title`          | `string`                                                             | Resolved and pluralized dialog title. |
| `description`    | `string`                                                             | Resolved and pluralized dialog body.  |
| `successMessage` | `string \| ReactNode \| ((count: number) => ReactNode) \| undefined` | Post-delete notification.             |
| `mutationMode`   | `'pessimistic' \| 'optimistic' \| 'undoable' \| undefined`           | Mutation behavior.                    |

## Context requirements

Must be called inside a `<List>` (or `<ListBase>`) tree so that `useListContext` can provide the selected IDs.

## See also

- [`<BulkDeleteButton>`](../buttons/BulkDeleteButton.md) — the built-in button that uses this hook
- [`useDeleteMeta`](./useDeleteMeta.md) — equivalent hook for single-record deletion
