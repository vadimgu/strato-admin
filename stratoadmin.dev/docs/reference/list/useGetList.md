---
sidebar_position: 12
---

# `useGetList`

React Query wrapper around the data provider's `getList` method. Use when you need to fetch a list of records outside of a `<List>` component.

## Signature

```ts
import { useGetList } from '@strato-admin/core';

function useGetList<T extends RaRecord>(
  resource: string,
  params?: {
    pagination?: { page: number; perPage: number };
    sort?: { field: string; order: 'ASC' | 'DESC' };
    filter?: object;
    meta?: object;
  },
  options?: UseQueryOptions,
): UseGetListResult<T>;
```

## Return value

Extends React Query's `UseQueryResult` with:

| Property     | Type                  | Description                         |
| ------------ | --------------------- | ----------------------------------- |
| `data`       | `T[]`                 | Fetched records                     |
| `total`      | `number \| undefined` | Total count of matching records     |
| `isPending`  | `boolean`             | `true` until first data arrives     |
| `isFetching` | `boolean`             | `true` while a request is in flight |
| `error`      | `Error \| null`       | Any error from the data provider    |

## Example

```tsx
import { useGetList } from '@strato-admin/core';

function FeaturedProducts() {
  const { data, isPending } = useGetList('products', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: { featured: true },
  });

  if (isPending) return <Spinner />;
  return (
    <ul>
      {data?.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## Notes

Fetched records are also written into the `getOne` cache, so any subsequent `useGetOne` calls for those IDs will be answered from cache without a network request.
