---
sidebar_position: 11
---

# `useListContext`

Returns the full `ListContext` state. Use when you need direct access to pagination, sort, filter, or selection state — for example to build a custom header, counter, or toolbar.

## Signature

```ts
import { useListContext } from '@strato-admin/core';

function useListContext<T extends RaRecord>(): ListControllerResult<T>
```

Must be called inside a `ListContext` (i.e. a descendant of `<List>`, `<ReferenceManyField>`, or `<ArrayField>`).

## Return value

| Property | Type | Description |
|---|---|---|
| `data` | `T[]` | Current page of records |
| `total` | `number \| undefined` | Total records matching current filters |
| `isPending` | `boolean` | `true` until data is fetched for the first time |
| `isFetching` | `boolean` | `true` while a request is in flight |
| `isLoading` | `boolean` | `true` on the very first load |
| `error` | `Error \| null` | Data provider error, if any |
| `page` | `number` | Current page (1-based) |
| `perPage` | `number` | Page size |
| `setPage` | `(page: number) => void` | Navigate to a page |
| `setPerPage` | `(perPage: number) => void` | Change page size |
| `sort` | `{ field: string; order: 'ASC' \| 'DESC' }` | Current sort |
| `setSort` | `(sort) => void` | Change sort |
| `filterValues` | `object` | Current filter values |
| `setFilters` | `(filters, displayedFilters?) => void` | Update filters |
| `selectedIds` | `Identifier[]` | IDs of selected records |
| `onSelect` | `(ids: Identifier[]) => void` | Replace selection |
| `onToggleItem` | `(id: Identifier) => void` | Toggle one record's selection |
| `onUnselectItems` | `() => void` | Clear selection |
| `resource` | `string` | Resource name |
| `hasNextPage` | `boolean \| undefined` | Whether a next page exists |
| `hasPreviousPage` | `boolean \| undefined` | Whether a previous page exists |

## Example

```tsx
import { useListContext } from '@strato-admin/core';

function RecordCount() {
  const { total, isPending } = useListContext();
  if (isPending) return null;
  return <span>{total} records</span>;
}
```
