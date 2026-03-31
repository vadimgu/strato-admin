---
sidebar_position: 1
---

# `<List>`

The page-level component for displaying a collection of records. It fetches data, manages pagination and sorting state, and renders a [`<Table>`](./Table.md) by default (or a [`<Cards>`](./Cards.md) if set as the resource's `listComponent`).

import PropsTable from '@site/src/components/PropsTable';

## Usage

With no children, `<List>` renders a `<Table>` automatically using the resource's schema fields.

```tsx
<List />
```

### Custom columns

Pass a `<Table>` child to control which columns appear.

```tsx
<List>
  <Table>
    <Table.Column source="name" />
    <Table.NumberColumn source="price" label="Price (USD)" />
  </Table>
</List>
```

### Include / Exclude columns

Use `include` or `exclude` to filter the auto-generated table without writing a custom `<Table>`.

```tsx
<List include={['name', 'price', 'category']} />
```

```tsx
<List exclude={['internalNotes']} />
```

### Title and description

```tsx
<List
  title="All Products"
  description="Browse and manage the product catalog."
/>
```

### Disabling filtering or preferences

```tsx
<List filtering={false} preferences={false} />
```

## Props

<PropsTable name="List" />
