---
sidebar_position: 7
title: 'Data Providers'
---

# Data Providers

A **data provider** is an adapter between Strato Admin and your API. It translates the framework's data requests — list records, fetch one, create, update, delete — into HTTP calls that match your backend's conventions.

Strato Admin uses the same `DataProvider` interface as [React-Admin](https://marmelab.com/react-admin/DataProviderIntroduction.html), which means **any React-Admin data provider works out of the box**.

## Passing a Data Provider

Pass your data provider to the `<Admin>` component's `dataProvider` prop:

```tsx
import { Admin, ResourceSchema } from '@strato-admin/admin';
import myDataProvider from './myDataProvider';

const App = () => (
  <Admin dataProvider={myDataProvider}>
    <ResourceSchema name="products" />
  </Admin>
);
```

## Using a Pre-built Data Provider

The easiest way to get started is to use a community data provider that already handles the HTTP mapping for your backend type. Any `ra-data-*` package from the React-Admin ecosystem is compatible.

```tsx
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
```

Popular options include:

| Package | Backend |
|---|---|
| `ra-data-json-server` | JSON Server |
| `ra-data-simple-rest` | Simple REST (CRUD with `Content-Range`) |
| `ra-data-fakerest` | In-memory fake data (for development/testing) |
| `ra-data-graphql` | GraphQL |

## The DataProvider Interface

A data provider is a plain object implementing nine methods. Each method receives a resource name (e.g. `"products"`) and a params object, and returns a Promise.

```ts
const dataProvider = {
  getList:           (resource, params) => Promise<{ data, total }>,
  getOne:            (resource, params) => Promise<{ data }>,
  getMany:           (resource, params) => Promise<{ data }>,
  getManyReference:  (resource, params) => Promise<{ data, total }>,
  create:            (resource, params) => Promise<{ data }>,
  update:            (resource, params) => Promise<{ data }>,
  updateMany:        (resource, params) => Promise<{ data }>,
  delete:            (resource, params) => Promise<{ data }>,
  deleteMany:        (resource, params) => Promise<{ data }>,
};
```

### `getList`

Fetches a paginated, sorted, filtered list of records. Called when rendering `<List>`.

```ts
getList('products', {
  pagination: { page: 1, perPage: 10 },
  sort:       { field: 'name', order: 'ASC' },
  filter:     { category_id: 3 },
})
// → { data: Product[], total: 42 }
```

The result must include `data` (an array of records) and either `total` (integer) or `pageInfo` (`{ hasNextPage, hasPreviousPage }`).

### `getOne`

Fetches a single record by ID. Called when rendering detail and edit views.

```ts
getOne('products', { id: 5 })
// → { data: Product }
```

### `getMany`

Fetches multiple records by an array of IDs. Called by `<ReferenceField>` to batch-load referenced records.

```ts
getMany('categories', { ids: [1, 2, 3] })
// → { data: Category[] }
```

### `getManyReference`

Fetches records related to another record (a "has many"). Called by `<ReferenceManyField>`.

```ts
getManyReference('reviews', {
  target: 'product_id',
  id: 5,
  pagination: { page: 1, perPage: 25 },
  sort: { field: 'date', order: 'DESC' },
  filter: {},
})
// → { data: Review[], total: 7 }
```

### `create`

Creates a new record. Called on form submit in a `<Create>` view.

```ts
create('products', { data: { name: 'Widget', price: 9.99 } })
// → { data: { id: 101, name: 'Widget', price: 9.99 } }
```

The returned `data` must include the new record's `id`.

### `update`

Updates an existing record. Called on form submit in an `<Edit>` view.

```ts
update('products', {
  id: 101,
  data: { name: 'Super Widget' },
  previousData: { id: 101, name: 'Widget', price: 9.99 },
})
// → { data: { id: 101, name: 'Super Widget', price: 9.99 } }
```

### `updateMany`

Bulk-updates multiple records. Called by bulk action buttons.

```ts
updateMany('products', { ids: [1, 2, 3], data: { status: 'archived' } })
// → { data: [1, 2, 3] }  // array of updated IDs
```

### `delete`

Deletes a single record.

```ts
delete('products', { id: 101, previousData: { id: 101, name: 'Widget' } })
// → { data: { id: 101, name: 'Widget' } }
```

### `deleteMany`

Bulk-deletes multiple records. Called by `<BulkDeleteButton>`.

```ts
deleteMany('products', { ids: [1, 2, 3] })
// → { data: [1, 2, 3] }  // array of deleted IDs
```

## Writing a Custom Data Provider

When your backend doesn't match any existing package, implement the interface directly. Strato Admin re-exports `fetchUtils` from its core to help with HTTP requests.

```ts
import { DataProvider, fetchUtils } from '@strato-admin/admin';

const API_URL = 'https://api.example.com';
const { fetchJson } = fetchUtils;

export const myDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = new URLSearchParams({
      _page:   String(page),
      _limit:  String(perPage),
      _sort:   field,
      _order:  order,
      ...params.filter,
    });
    const { json, headers } = await fetchJson(`${API_URL}/${resource}?${query}`);
    return {
      data:  json,
      total: parseInt(headers.get('X-Total-Count') ?? '0', 10),
    };
  },

  getOne: async (resource, params) => {
    const { json } = await fetchJson(`${API_URL}/${resource}/${params.id}`);
    return { data: json };
  },

  getMany: async (resource, params) => {
    const ids = params.ids.map(id => `id=${id}`).join('&');
    const { json } = await fetchJson(`${API_URL}/${resource}?${ids}`);
    return { data: json };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const query = new URLSearchParams({
      [params.target]: String(params.id),
      _page:  String(page),
      _limit: String(perPage),
    });
    const { json, headers } = await fetchJson(`${API_URL}/${resource}?${query}`);
    return {
      data:  json,
      total: parseInt(headers.get('X-Total-Count') ?? '0', 10),
    };
  },

  create: async (resource, params) => {
    const { json } = await fetchJson(`${API_URL}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: json };
  },

  update: async (resource, params) => {
    const { json } = await fetchJson(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return { data: json };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetchJson(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        })
      )
    );
    return { data: params.ids };
  },

  delete: async (resource, params) => {
    const { json } = await fetchJson(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE',
    });
    return { data: json };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetchJson(`${API_URL}/${resource}/${id}`, { method: 'DELETE' })
      )
    );
    return { data: params.ids };
  },
};
```

## Error Handling

Throw an `HttpError` to let the framework surface API errors to the user:

```ts
import { HttpError } from '@strato-admin/admin';

getOne: async (resource, params) => {
  const response = await fetch(`${API_URL}/${resource}/${params.id}`);
  if (response.status === 404) {
    throw new HttpError('Record not found', 404);
  }
  const json = await response.json();
  return { data: json };
},
```

`HttpError(message, status, body)` accepts the error message, HTTP status code, and optional response body.

## Adding Lifecycle Callbacks

`withLifecycleCallbacks` wraps a data provider to run code before or after specific operations without replacing the provider:

```ts
import { withLifecycleCallbacks } from '@strato-admin/admin';

const dataProvider = withLifecycleCallbacks(baseProvider, [
  {
    resource: 'products',
    beforeSave: async (data, provider) => {
      // normalize data before create/update
      return { ...data, name: data.name.trim() };
    },
    afterDelete: async (result, provider) => {
      // clean up related data after delete
      await provider.deleteMany('reviews', {
        ids: result.data.reviewIds,
      });
      return result;
    },
  },
]);
```

## Combining Multiple Data Providers

`combineDataProviders` routes requests to different providers based on the resource name:

```ts
import { combineDataProviders } from '@strato-admin/admin';
import restProvider from 'ra-data-simple-rest';
import graphqlProvider from './graphqlProvider';

const dataProvider = combineDataProviders((resource) => {
  if (['posts', 'comments'].includes(resource)) return graphqlProvider;
  return restProvider('https://api.example.com');
});
```
