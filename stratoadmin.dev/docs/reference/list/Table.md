---
sidebar_position: 2
---

# `<Table>`

A data table that renders records from a `ListContext`. Used as the default display component inside [`<List>`](./List.md), and also usable inside [`<ReferenceManyField>`](../fields/ReferenceManyField.md) or [`<ArrayField>`](../fields/ArrayField.md).

import PropsTable from '@site/src/components/PropsTable';

## Usage

`<Table>` reads its data from the nearest `ListContext`. When used inside `<List>`, that context is provided automatically.

```tsx
<List>
  <Table>
    <Table.Column source="name" />
    <Table.NumberColumn source="price" />
    <Table.DateColumn source="createdAt" />
  </Table>
</List>
```

### Embedded variant

When used inside a `<ReferenceManyField>`, pass `variant="embedded"` to reduce visual weight.

```tsx
<ReferenceManyField reference="order_items" target="orderId">
  <Table variant="embedded">
    <Table.Column source="productName" />
    <Table.NumberColumn source="quantity" />
  </Table>
</ReferenceManyField>
```

### Disabling features

```tsx
<Table filtering={false} preferences={false} />
```

### Default visible columns

Use `display` to control which columns are visible by default (others are still available via preferences).

```tsx
<Table display={['name', 'price']}>
  <Table.Column source="name" />
  <Table.Column source="sku" />
  <Table.NumberColumn source="price" />
  <Table.Column source="category" />
</Table>
```

## Column components

| Component               | Renders with                                   |
| ----------------------- | ---------------------------------------------- |
| `Table.Column`          | `<TextField>`                                  |
| `Table.NumberColumn`    | `<NumberField>` (right-aligned)                |
| `Table.DateColumn`      | `<DateField>`                                  |
| `Table.BooleanColumn`   | `<BooleanField>`                               |
| `Table.ReferenceColumn` | `<ReferenceField>` — requires `reference` prop |

All column components accept a `source` prop and an optional `link` prop (see [common field props](../fields/common-props.md#link)). You can also pass a custom `field` component:

```tsx
<Table.Column source="status" field={StatusIndicatorField} />
```

Or render custom content as children:

```tsx
<Table.Column source="name">
  <MyCustomField source="name" />
</Table.Column>
```

## Props

<PropsTable name="Table" />
