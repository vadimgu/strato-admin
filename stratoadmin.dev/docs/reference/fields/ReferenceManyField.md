---
sidebar_position: 11
---

# `<ReferenceManyField>`

Fetches and displays a list of records from another resource that reference the current record. Renders as a table using the referenced resource's schema by default.

import PropsTable from '@site/src/components/PropsTable';

## Usage

The required props are `reference` (the related resource name) and `target` (the foreign key field on the related resource).

```tsx
<ReferenceManyField reference="comments" target="postId" />
```

### Custom Table

Pass a child `<Table>` to control which columns are shown.

```tsx
<ReferenceManyField reference="comments" target="postId">
  <Table title="Comments">
    <Table.Column source="id" />
    <Table.Column source="body" />
    <Table.Column source="createdAt" />
  </Table>
</ReferenceManyField>
```

### Filtering and Preferences

```tsx
<ReferenceManyField
  reference="orders"
  target="customerId"
  filtering
  preferences
  title="Orders"
/>
```

### Include / Exclude Columns

When relying on the auto-generated table from the resource schema, use `include` or `exclude` to control which columns appear.

```tsx
<ReferenceManyField
  reference="reviews"
  target="productId"
  exclude={['productId']}
/>
```

## Props

<PropsTable name="ReferenceManyField" />
