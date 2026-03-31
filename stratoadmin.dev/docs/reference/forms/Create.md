---
sidebar_position: 1
---

# `<Create>`

The page-level component for creating a new record. It wraps a `<Form>` in a Cloudscape `Container` with a header, and submits the form data to the data provider's `create` method.

import PropsTable from '@site/src/components/PropsTable';

## Usage

With no children, `<Create>` renders a form automatically using the resource's input schema.

```tsx
<Create />
```

### Custom inputs

Pass a `<Form>` child with inputs to control what fields appear.

```tsx
<Create>
  <Form>
    <TextInput source="name" label="Product Name" />
    <NumberInput source="price" label="Price" />
  </Form>
</Create>
```

### Include / Exclude inputs

Use `include` or `exclude` to filter the auto-generated form without writing a custom `<Form>`.

```tsx
<Create include={['name', 'price']} />
```

### Title and description

```tsx
<Create title="Add Product" description="Fill in the details to create a new product." />
```

### Custom save button label

```tsx
<Create saveButtonLabel="Add to catalog" />
```

### Redirect after save

By default, `<Create>` redirects to the list view after a successful save. Override with `redirect`:

```tsx
<Create redirect="detail" />
```

## Props

<PropsTable name="Create" />
