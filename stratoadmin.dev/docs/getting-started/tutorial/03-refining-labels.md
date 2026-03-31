# Refining Field Labels

By default, Strato Admin derives labels from your resource and field names. A resource named `products` will be labeled "Products" in the menu, and a field with `source="price"` will be labeled "Price" in tables and forms.

However, you often want more control over how these are presented to your users.

## Field Labels

You can override the label of any field by providing the `label` prop. This is useful when the data source name is technical or doesn't match your preferred terminology.

```tsx title="src/App.tsx" {2-5} showLineNumbers
<ResourceSchema name="products">
  <TextField source="id" label="Product ID" />
  <TextField source="name" label="Product Name" />
  <NumberField source="price" label="Unit Price" />
  <TextField source="description" label="Short Description" />
</ResourceSchema>
```

## Resource Labels

Resources also have labels used in the navigation menu, breadcrumbs, and page titles. By default, Strato Admin uses a humanized version of the resource `name`.

If you want to customize these, you can use the `options` prop or the `label` shortcut on `<ResourceSchema>`:

```tsx title="src/App.tsx" showLineNumbers
<ResourceSchema name="products" label="Catalog">
  {/* ... fields ... */}
</ResourceSchema>
```

## Overriding Page Titles and Descriptions

While the resource `label` provides a sensible default for all views, you may want to provide more specific titles or descriptions for the **List**, **Create**, **Edit**, or **Detail** pages.

You can use the following props on `<ResourceSchema>`:

- `listTitle` / `listDescription`
- `createTitle` / `createDescription`
- `editTitle` / `editDescription`
- `detailTitle` / `detailDescription`

Each prop accepts a **string**, a **React element**, or (for Edit and Detail) a **function** that receives the current record:

```tsx title="src/App.tsx" showLineNumbers
<ResourceSchema
  name="products"
  listTitle="Product Inventory"
  listDescription="Manage your stock and pricing"
  createTitle="Add New Product"
  editTitle={(record) => `Editing ${record.name}`}
  detailTitle={<TextField source="name" />}
>
  {/* ... fields ... */}
</ResourceSchema>
```

Passing a React element is useful for the **Detail** and **Edit** titles when you want to render the record value using an existing field component (e.g., `<TextField source="name" />` renders the product name directly from the record context).

For the **Edit** and **Detail** views, the title can also be a function that receives the current record, letting you build dynamic strings (like including the item's name).

:::warning[Language Inflection]
Strato Admin constructs phrases like "Create [Resource Name]" or "Edit [Resource
Name]" when the current locale is English (starts with `en`). While this works
well in English, it may lead to grammatically incorrect syntax in languages with
complex inflection or gendered nouns.

For non-English locales, Strato Admin uses generic page titles such as "Create",
"Edit", or "Details" without the resource name. You can provide explicit titles
for your pages using the `listTitle`, `createTitle`, `editTitle`, or `detailTitle`
props on `<ResourceSchema>`.
:::

## Why use Labels?

1. **User Clarity:** Technical field names like `is_active` can be shown as "Active Status".
2. **Context:** In a "Product" resource, a field named `name` is obviously the product name, but "Product Name" might be clearer in some contexts.
3. **Consistency:** Ensure your UI matches the terminology used by your business users.

## Next Steps

Now that our labels look great, let's see how to handle **Relationships** and connect our products to categories.
