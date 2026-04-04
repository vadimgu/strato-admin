---
sidebar_label: useEditMeta
---

# `useEditMeta`

Resolves the title, description, redirect, success message, and mutation mode for the Edit view. Use this inside a component rendered within `<Edit>` to consume fully-resolved metadata without manually wiring schema values, translations, and settings.

```tsx
import { useEditMeta } from '@strato-admin/core';

const MyEditHeader = ({ title, description }) => {
  const { title: resolvedTitle } = useEditMeta({ title, description });
  return <Header>{resolvedTitle}</Header>;
};
```

## Signature

```ts
function useEditMeta(props?: UseEditMetaProps): {
  title: ReactNode;
  description: ReactNode | undefined;
  successMessage: string | ReactNode | undefined;
  redirect: 'list' | 'detail' | false | undefined;
  mutationMode: 'pessimistic' | 'optimistic' | 'undoable' | undefined;
};

interface UseEditMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value in this priority:

1. The prop passed directly to the hook (`props.title` / `props.description`)
2. The schema value from `<ResourceSchema>` (`editTitle` / `editDescription`)
3. A constructed default title of the form `"Edit {ResourceLabel}"` (title only)

String values are passed through `useTranslate`, so they can be translation keys. Function values are called with the current `record` and their return value is used. While the record is loading, `title` returns `''` and `description` returns `undefined`.

For `successMessage`, `redirect`, and `mutationMode`, the hook falls back to the [`<Settings>`](../Settings.md) values.

## Parameters

| Name                | Type                                   | Description                                   |
| :------------------ | :------------------------------------- | :-------------------------------------------- |
| `props.title`       | `ReactNode \| ((record) => ReactNode)` | Overrides the schema and default title.       |
| `props.description` | `ReactNode \| ((record) => ReactNode)` | Overrides the schema description. No default. |

## Return value

| Field            | Type                                                       | Description                                       |
| :--------------- | :--------------------------------------------------------- | :------------------------------------------------ |
| `title`          | `ReactNode`                                                | Fully resolved title. Empty string while loading. |
| `description`    | `ReactNode \| undefined`                                   | Fully resolved description, or `undefined`.       |
| `successMessage` | `string \| ReactNode \| undefined`                         | Notification shown after a successful save.       |
| `redirect`       | `'list' \| 'detail' \| false \| undefined`                 | Where to navigate after save.                     |
| `mutationMode`   | `'pessimistic' \| 'optimistic' \| 'undoable' \| undefined` | How the save mutation behaves.                    |

## Context requirements

Must be called inside an `<Edit>` (or `<EditBase>`) tree and inside a `<ResourceSchemaProvider>`.

## See also

- [`<Edit>`](../forms/Edit.md) — the component that wraps the edit context
- [`useListMeta`](./useListMeta.md), [`useCreateMeta`](./useCreateMeta.md), [`useDetailMeta`](./useDetailMeta.md) — equivalent hooks for other views
