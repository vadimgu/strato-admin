---
sidebar_label: useListMeta
---

# `useListMeta`

Resolves the title, description, and display settings for the List view. Use this inside a component rendered within `<List>` to consume the fully-resolved metadata without manually wiring schema values, translations, and settings.

```tsx
import { useListMeta } from '@strato-admin/core';

const MyListHeader = ({ title, description }) => {
  const { title: resolvedTitle, description: resolvedDescription } = useListMeta({ title, description });
  return <Header>{resolvedTitle}</Header>;
};
```

## Signature

```ts
function useListMeta(props?: UseListMetaProps): {
  title: ReactNode;
  description: ReactNode | undefined;
  component: ComponentType<any> | undefined;
  perPage: number | undefined;
  pageSizes: number[] | undefined;
  pageSizeLabel: string | undefined;
};

interface UseListMetaProps {
  title?: ReactNode | (() => ReactNode);
  description?: ReactNode | (() => ReactNode);
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value in this priority:

1. The prop passed directly to the hook (`props.title` / `props.description`)
2. The schema value from `<ResourceSchema>` (`listTitle` / `listDescription`)
3. A constructed default title of the form `"List {ResourceLabel}"` (title only)

String values are passed through `useTranslate`, so they can be translation keys. Function values are called with an empty object `{}` and their return value is used.

For `perPage`, `pageSizes`, and `pageSizeLabel`, the hook falls back to the [`<Settings>`](../Settings.md) values.

## Parameters

| Name                | Type                             | Description                                   |
| :------------------ | :------------------------------- | :-------------------------------------------- |
| `props.title`       | `ReactNode \| (() => ReactNode)` | Overrides the schema and default title.       |
| `props.description` | `ReactNode \| (() => ReactNode)` | Overrides the schema description. No default. |

## Return value

| Field           | Type                         | Description                                        |
| :-------------- | :--------------------------- | :------------------------------------------------- |
| `title`         | `ReactNode`                  | Fully resolved title.                              |
| `description`   | `ReactNode \| undefined`     | Fully resolved description, or `undefined`.        |
| `component`     | `ComponentType \| undefined` | Custom list component from schema, or `undefined`. |
| `perPage`       | `number \| undefined`        | Default page size from schema or settings.         |
| `pageSizes`     | `number[] \| undefined`      | Available page size options from settings.         |
| `pageSizeLabel` | `string \| undefined`        | Label for the page size selector from settings.    |

## Context requirements

Must be called inside a `<List>` (or `<ListBase>`) tree and inside a `<ResourceSchemaProvider>`.

## See also

- [`<List>`](../list/List.md) — the component that wraps the list context
- [`useEditMeta`](./useEditMeta.md), [`useCreateMeta`](./useCreateMeta.md), [`useDetailMeta`](./useDetailMeta.md) — equivalent hooks for other views
