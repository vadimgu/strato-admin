---
sidebar_position: 12
---

# `<ArrayField>`

Used to display an array of data stored in a single field. It provides a `ListContext` to its children, allowing them to use other field or table components to display the array's elements.

import PropsTable from '@site/src/components/PropsTable';

## Usage

Typically used with a `Table` or `Cards` component to display nested data.

```tsx
<ArrayField source="items" resource="order_items">
  <Table variant="embedded">
    <Column source="productName" label="Product" />
    <NumberColumn source="quantity" label="Quantity" />
    <NumberColumn source="price" label="Price" />
  </Table>
</ArrayField>
```

## Props

<PropsTable name="ArrayField" />
