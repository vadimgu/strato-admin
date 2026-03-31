---
sidebar_position: 1
---

# `<Detail>`

The page-level component for displaying a single record. It fetches the record by ID and renders a [`<DetailHub>`](./DetailHub.md) by default, which organizes fields into a header, scalar key-value section, and collection sections.

import PropsTable from '@site/src/components/PropsTable';

## Usage

With no children, `<Detail>` renders using the resource's schema fields automatically.

```tsx
<Detail />
```

### Custom fields

Pass field components as children to control what is displayed.

```tsx
<Detail>
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
  <ReferenceManyField reference="reviews" target="productId" />
</Detail>
```

### Title and description

```tsx
<Detail title="Product Details" description="View all product information." />
```

The `title` and `description` props also accept a function that receives the current record:

```tsx
<Detail title={(record) => `Product: ${record.name}`} />
```

## Props

<PropsTable name="Detail" />
