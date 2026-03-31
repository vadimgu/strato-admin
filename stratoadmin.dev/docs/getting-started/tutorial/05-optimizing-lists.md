# Optimizing List Views

In the previous chapters, we saw how Strato Admin automatically generates a list view for our resources. In this chapter, we will learn how to customize this view while staying within the **Schema-First** paradigm.

## Selecting and Excluding Fields

By default, every field defined as a child of `<ResourceSchema>` is displayed in the List, Show, Create, and Edit views. However, you often want to show a more concise table in the List view than you do in the Show view.

You can use the `listInclude` prop to explicitly select which fields should appear in the table, or `listExclude` to hide specific ones.

Update `src/App.tsx` to refine the product list:

```tsx title="src/App.tsx"
<ResourceSchema name="products" listInclude={['name', 'price', 'category_id']}>
  <TextField source="id" />
  <TextField source="name" />
  <NumberField source="price" />
  <TextField source="description" />
  <ReferenceField source="category_id" reference="categories" />
</ResourceSchema>
```

In this example, the `id` and `description` fields will still be available in the **Show** and **Edit** views, but they will no longer clutter the **List** table.

## Default Column Visibility

While `listInclude` and `listExclude` control which fields are _available_ in the table, you may want to have some fields available but hidden by default. This is useful when you have many columns and don't want to overwhelm the user, but still want to give them the option to enable certain columns through the **Table Preferences**.

Use the `listDisplay` prop to define which of the included fields should be visible when the page first loads:

```tsx title="src/App.tsx"
<ResourceSchema
  name="products"
  listInclude={['name', 'price', 'category_id', 'stock', 'updatedAt']}
  listDisplay={['name', 'price', 'category_id']}
>
  {/* Fields... */}
</ResourceSchema>
```

In this case, the `stock` and `updatedAt` columns will be available in the table's "Select visible columns" menu, but they won't be visible until the user explicitly turns them on. If `listDisplay` is not provided, the table defaults to showing the first 5 columns.

## Sorting and Pagination

You can also control how your data is initially presented to the user. Use the `defaultSort` prop to define the initial sorting order and `perPage` to control the number of records displayed.

```tsx title="src/App.tsx"
<ResourceSchema
  name="products"
  listInclude={['name', 'price', 'category_id']}
  defaultSort={{ field: 'name', order: 'ASC' }}
  perPage={25}
>
  {/* Fields... */}
</ResourceSchema>
```

## Default Filters

Often you want to restrict the data shown in a list by default. For example, you might want to show only "active" products or products from a specific category.

Use the `defaultFilters` prop to apply permanent filters to the list view:

```tsx title="src/App.tsx"
<ResourceSchema name="products" defaultFilters={{ category_id: 1 }}>
  {/* Fields... */}
</ResourceSchema>
```

These filters are applied to all requests made by the list view and cannot be removed by the user through the UI.

## Summary

Optimizing your list view doesn't require building new components. By using props on `<ResourceSchema>`, you can:

- Control field visibility across different views.
- Set default sorting and pagination.
- Maintain a clean and focused user interface.

## Next Steps

In the next chapter, we'll look at how to **Enhance Form Inputs** to handle more complex data entry.
