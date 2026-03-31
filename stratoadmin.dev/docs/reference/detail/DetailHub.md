---
sidebar_position: 2
---

# `<DetailHub>`

The default layout component rendered by [`<Detail>`](./Detail.md). It automatically separates scalar fields (text, numbers, dates, etc.) from collection fields (like [`<ReferenceManyField>`](../fields/ReferenceManyField.md)), rendering them in distinct sections:

1. A page header with title, description, and actions (e.g. Edit button)
2. A `Container` with a [`<KeyValuePairs>`](./KeyValuePairs.md) for scalar fields
3. Collection fields (each rendered below the main container)

import PropsTable from '@site/src/components/PropsTable';

## Usage

`<DetailHub>` is used automatically by `<Detail>` — you rarely need to use it directly. The most common reason is to set it as a resource's `detailComponent` in the schema.

```tsx
<ResourceSchema name="products" detailComponent={DetailHub}>
  ...
</ResourceSchema>
```

### Custom layout

You can pass children to override the auto-layout. Scalar and collection fields are still separated automatically.

```tsx
<DetailHub title="Product Details">
  <KeyValuePairs columns={2} />
  <ReferenceManyField reference="reviews" target="productId" />
</DetailHub>
```

### Include / Exclude

Control which fields appear using `detailInclude` or `detailExclude` on the `ResourceSchema`:

```tsx
<ResourceSchema name="products" detailExclude={['internalNotes']}>
  ...
</ResourceSchema>
```

## Props

<PropsTable name="DetailHub" />
