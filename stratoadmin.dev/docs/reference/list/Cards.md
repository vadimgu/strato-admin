---
sidebar_position: 3
---

# `<Cards>`

A card grid that renders records from a `ListContext`. An alternative to [`<Table>`](./Table.md) for list views — each record is displayed as a Cloudscape card with key-value pairs derived from the resource schema.

import PropsTable from '@site/src/components/PropsTable';

## Usage

Use `<Cards>` inside [`<List>`](./List.md) instead of the default `<Table>`.

```tsx
<List>
  <Cards />
</List>
```

### Custom fields

Pass field components as children to control which fields appear on each card.

```tsx
<List>
  <Cards>
    <TextField source="name" />
    <CurrencyField source="price" currency="USD" />
    <BadgeField source="status" />
  </Cards>
</List>
```

### Include / Exclude

```tsx
<Cards include={['name', 'price']} />
```

### Custom card rendering

Use `renderItem` to fully control each card's content.

```tsx
<Cards
  renderItem={(record) => (
    <div>
      <strong>{record.name}</strong>
      <p>{record.description}</p>
    </div>
  )}
/>
```

### Set as default list component

To use `<Cards>` as the default for a resource, set `listComponent` on the `ResourceSchema`:

```tsx
<ResourceSchema name="products" listComponent={Cards}>
  ...
</ResourceSchema>
```

## Props

<PropsTable name="Cards" />
