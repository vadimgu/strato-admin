---
sidebar_label: useDetailMeta
---

# `useDetailMeta`

Resolves the title, description, and detail component for the Detail view. Use this inside a component rendered within `<Detail>` to consume fully-resolved metadata without manually wiring schema values, translations, and settings.

```tsx
import { useDetailMeta } from '@strato-admin/core';

const MyDetailHeader = ({ title, description }) => {
  const { title: resolvedTitle } = useDetailMeta({ title, description });
  return <Header>{resolvedTitle}</Header>;
};
```

## Signature

```ts
function useDetailMeta(props?: UseDetailMetaProps): {
  title: ReactNode;
  description: ReactNode | undefined;
  component: ComponentType<any> | undefined;
};

interface UseDetailMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}
```

## Resolution order

For `title` and `description`, the hook resolves the first defined value in this priority:

1. The prop passed directly to the hook (`props.title` / `props.description`)
2. The schema value from `<ResourceSchema>` (`detailTitle` / `detailDescription`)
3. A constructed default title of the form `"Detail {ResourceLabel}"` (title only)

String values are passed through `useTranslate`, so they can be translation keys. Function values are called with the current `record` and their return value is used. While the record is loading, `title` returns `''` and `description` returns `undefined`.

## Parameters

| Name                | Type                                   | Description                                   |
| :------------------ | :------------------------------------- | :-------------------------------------------- |
| `props.title`       | `ReactNode \| ((record) => ReactNode)` | Overrides the schema and default title.       |
| `props.description` | `ReactNode \| ((record) => ReactNode)` | Overrides the schema description. No default. |

## Return value

| Field         | Type                         | Description                                          |
| :------------ | :--------------------------- | :--------------------------------------------------- |
| `title`       | `ReactNode`                  | Fully resolved title. Empty string while loading.    |
| `description` | `ReactNode \| undefined`     | Fully resolved description, or `undefined`.          |
| `component`   | `ComponentType \| undefined` | Custom detail component from schema, or `undefined`. |

## Context requirements

Must be called inside a `<Detail>` (or `<ShowBase>`) tree and inside a `<ResourceSchemaProvider>`.

## See also

- [`<Detail>`](../detail/Detail.md) — the component that wraps the detail context
- [`<DetailHub>`](../detail/DetailHub.md) — the default detail layout component
- [`useListMeta`](./useListMeta.md), [`useEditMeta`](./useEditMeta.md), [`useCreateMeta`](./useCreateMeta.md) — equivalent hooks for other views
