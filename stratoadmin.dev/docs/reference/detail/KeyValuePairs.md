---
sidebar_position: 3
---

# `<KeyValuePairs>`

Renders record fields as a labeled key-value grid using the Cloudscape `KeyValuePairs` component. Used by default inside [`<DetailHub>`](./DetailHub.md), and also usable inside [`<Cards>`](../list/Cards.md) card layouts.

import PropsTable from '@site/src/components/PropsTable';

## Usage

With no children, renders all scalar fields from the resource schema.

```tsx
<KeyValuePairs />
```

### Custom fields

Pass field components as children to control what is displayed and in what order.

```tsx
<KeyValuePairs columns={2}>
  <TextField source="name" label="Full Name" />
  <DateField source="createdAt" />
  <CurrencyField source="price" currency="USD" />
</KeyValuePairs>
```

### Using `KeyValuePairs.Field`

`KeyValuePairs.Field` is a helper column component (analogous to `Table.Column`) that lets you specify a custom field component or children:

```tsx
<KeyValuePairs>
  <KeyValuePairs.Field source="status" field={StatusIndicatorField} />
  <KeyValuePairs.Field source="name">
    <MyCustomField source="name" />
  </KeyValuePairs.Field>
</KeyValuePairs>
```

### Include / Exclude

```tsx
<KeyValuePairs include={['name', 'price', 'category']} />
```

```tsx
<KeyValuePairs exclude={['internalNotes']} />
```

## Props

<PropsTable name="KeyValuePairs" />
