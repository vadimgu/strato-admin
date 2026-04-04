---
sidebar_label: useCreateMeta
---

# `useCreateMeta`

Resolves the title, description, redirect, and success message for the Create view. Use this inside a component rendered within `<Create>` to consume fully-resolved metadata without manually wiring schema values, translations, and settings.

```tsx
import { useCreateMeta } from '@strato-admin/core';

const MyCreateHeader = ({ title, description }) => {
  const { title: resolvedTitle } = useCreateMeta({ title, description });
  return <Header>{resolvedTitle}</Header>;
};
```

## Signature

```ts
function useCreateMeta(props?: UseCreateMetaProps): {
  title: ReactNode;
  description: ReactNode | undefined;
  successMessage: string | ReactNode | undefined;
  redirect: 'list' | 'detail' | false | undefined;
};

interface UseCreateMetaProps {
  title?: ReactNode | (() => ReactNode);
  description?: ReactNode | (() => ReactNode);
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value in this priority:

1. The prop passed directly to the hook (`props.title` / `props.description`)
2. The schema value from `<ResourceSchema>` (`createTitle` / `createDescription`)
3. A constructed default title of the form `"Create {ResourceLabel}"` (title only)

String values are passed through `useTranslate`, so they can be translation keys. Function values are called with an empty object `{}` and their return value is used.

For `successMessage` and `redirect`, the hook falls back to the [`<Settings>`](../Settings.md) values.

## Parameters

| Name                | Type                             | Description                                   |
| :------------------ | :------------------------------- | :-------------------------------------------- |
| `props.title`       | `ReactNode \| (() => ReactNode)` | Overrides the schema and default title.       |
| `props.description` | `ReactNode \| (() => ReactNode)` | Overrides the schema description. No default. |

## Return value

| Field            | Type                                       | Description                                    |
| :--------------- | :----------------------------------------- | :--------------------------------------------- |
| `title`          | `ReactNode`                                | Fully resolved title.                          |
| `description`    | `ReactNode \| undefined`                   | Fully resolved description, or `undefined`.    |
| `successMessage` | `string \| ReactNode \| undefined`         | Notification shown after a successful create.  |
| `redirect`       | `'list' \| 'detail' \| false \| undefined` | Where to navigate after the record is created. |

## Context requirements

Must be called inside a `<Create>` (or `<CreateBase>`) tree and inside a `<ResourceSchemaProvider>`.

## See also

- [`<Create>`](../forms/Create.md) — the component that wraps the create context
- [`useListMeta`](./useListMeta.md), [`useEditMeta`](./useEditMeta.md), [`useDetailMeta`](./useDetailMeta.md) — equivalent hooks for other views
