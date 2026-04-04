---
sidebar_label: useDeleteMeta
---

# `useDeleteMeta`

Resolves the confirmation dialog title, description, success message, and mutation mode for single-record delete operations. Use this inside a component rendered within a record context (Detail, Edit, or a List row).

```tsx
import { useDeleteMeta } from '@strato-admin/core';

const MyDeleteButton = ({ dialogTitle, dialogDescription }) => {
  const { title, description } = useDeleteMeta({
    title: dialogTitle,
    description: dialogDescription,
  });
  // title and description are already translated strings
};
```

## Signature

```ts
function useDeleteMeta(props?: UseDeleteMetaProps): {
  title: string;
  description: string;
  successMessage: string | ReactNode | undefined;
  mutationMode: 'pessimistic' | 'optimistic' | 'undoable' | undefined;
};

interface UseDeleteMetaProps {
  title?: string;
  description?: string;
  successMessage?: string | ReactNode;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value:

1. The prop passed directly to the hook
2. The schema value from `<ResourceSchema>` (`deleteTitle` / `deleteDescription`)
3. The built-in default translation key (`strato.message.delete_title` / `strato.message.delete_content`)

All values are treated as ICU translation keys and formatted via `useTranslate`. The built-in defaults produce `"Delete this item"` and `"Are you sure you want to delete this item?"`.

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

| Field            | Type                                                       | Description               |
| :--------------- | :--------------------------------------------------------- | :------------------------ |
| `title`          | `string`                                                   | Resolved dialog title.    |
| `description`    | `string`                                                   | Resolved dialog body.     |
| `successMessage` | `string \| ReactNode \| undefined`                         | Post-delete notification. |
| `mutationMode`   | `'pessimistic' \| 'optimistic' \| 'undoable' \| undefined` | Mutation behavior.        |

## See also

- [`<DeleteButton>`](../buttons/DeleteButton.md) — the built-in button that uses this hook
- [`useBulkDeleteMeta`](./useBulkDeleteMeta.md) — equivalent hook for bulk deletion
