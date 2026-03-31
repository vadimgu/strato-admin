---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Rendering a List

The List view is one of the most common pages in any admin interface. Strato Admin provides a powerful controller that fetches records from your data provider, handles pagination, sorting, and filtering, and exposes this data to your UI components.

Depending on your needs, you can render a list using the **Schema-First** approach (fastest), **View-Mode** (more customizable), or **Headless** hooks (complete control).

## Usage

<Tabs>
  <TabItem value="schema" label="Schema-First (Recommended)" default>
    In the Schema-First approach, you don't even need to use the `<List>` component directly. The `<StratoResource>` automatically generates the list view based on your `<ResourceSchema>`.

    ```tsx
    import { StratoResource, ResourceSchema, TextField, NumberField } from '@strato-admin/admin';

    export const ProductResource = () => (
        <StratoResource name="products">
            <ResourceSchema>
                <TextField source="name" label="Product Name" />
                <NumberField source="price" label="Price" />
            </ResourceSchema>
        </StratoResource>
    );
    ```

  </TabItem>
  <TabItem value="view" label="View-Mode (Components)">
    If you need to customize the table layout, add actions, or change the default list parameters, you can use the `<List>` and `<Table>` components directly.

    ```tsx
    import { List, Table, TextField, NumberField } from '@strato-admin/admin';

    export const ProductList = () => (
        <List perPage={25} sort={{ field: 'name', order: 'ASC' }}>
            <Table title="Products">
                <TextField source="name" label="Product Name" />
                <NumberField source="price" label="Price" />
            </Table>
        </List>
    );
    ```

  </TabItem>
  <TabItem value="headless" label="Headless (Hooks)">
    For total control over the UI, use the `useListController` hook to fetch data, and render your own custom Cloudscape components (or any other UI).

    ```tsx
    import { useListController } from '@strato-admin/admin';
    import { Cards, Spinner } from '@cloudscape-design/components';

    export const CustomProductList = () => {
        const { data, isLoading } = useListController();

        if (isLoading) return <Spinner />;

        return (
            <Cards
                cardDefinition={{
                    header: item => item.name,
                    sections: [{ id: 'price', content: item => `$${item.price}` }]
                }}
                items={data || []}
            />
        );
    };
    ```

  </TabItem>
</Tabs>

## The `<List>` Component

When using **View-Mode**, the `<List>` component is a controller component that provides the data and state management. It is responsible for fetching records from the data provider and providing a `ListContext` to its children (like `<Table>` or `<Cards>`).

In Strato Admin, `<List>` is a headless component (based on React Admin's `ListBase`) that handles pagination, sorting, and filtering without rendering any UI of its own.

## Props

The `<List>` component accepts all props supported by React Admin's `ListBase`.

### `resource`

The resource name. If not provided, it will be inferred from the current `ResourceContext`.

### `perPage`

The number of records to display per page.
**Default:** `10`

### `sort`

The default sort field and order.
**Example:** `{ field: 'published_at', order: 'DESC' }`

### `filter`

Permanent filters applied to all queries.
**Example:** `<List filter={{ is_active: true }}>`

### `debounce`

The debounce delay for filter queries in milliseconds.
**Default:** `500`

### `disableSyncWithLocation`

If `true`, the list parameters (page, sort, filters) will not be synchronized with the URL.
**Default:** `false`

### `queryOptions`

Options passed to the underlying `react-query` hook. This can be used for custom `onSuccess` or `onError` handlers.

## Context

`<List>` provides a `ListContext` which contains:

- `data`: The array of records for the current page.
- `total`: The total number of records matching the filters.
- `isLoading`: Whether the data is currently being fetched.
- `page`: The current page number.
- `setPage`: A function to change the current page.
- `sort`: The current sort configuration.
- `setSort`: A function to change the sort.
- `filterValues`: The current filter values.
- `setFilters`: A function to update the filters.
