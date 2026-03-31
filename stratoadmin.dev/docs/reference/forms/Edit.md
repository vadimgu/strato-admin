---
sidebar_position: 1
---

# `<Edit>`

The page-level component for editing an existing record. It fetches the record by ID, wraps a `<Form>` in a Cloudscape `Container` with a header, and submits changes to the data provider's `update` method.

import PropsTable from '@site/src/components/PropsTable';

## Usage

With no children, `<Edit>` renders a form automatically using the resource's input schema.

```tsx
<Edit />
```

### Custom inputs

Pass a `<Form>` child with inputs to control what fields appear.

```tsx
<Edit>
  <Form>
    <TextInput source="name" label="Product Name" />
    <NumberInput source="price" label="Price" />
  </Form>
</Edit>
```

### Include / Exclude inputs

Use `include` or `exclude` to filter the auto-generated form without writing a custom `<Form>`.

```tsx
<Edit include={['name', 'price']} />
```

### Title and description

The `title` and `description` props accept a string, React node, or a function receiving the current record:

```tsx
<Edit title={(record) => `Edit: ${record.name}`} />
```

### Custom save button label

```tsx
<Edit saveButtonLabel="Update product" />
```

### Redirect after save

By default, `<Edit>` redirects to the detail view after a successful save. Override with `redirect`:

```tsx
<Edit redirect="list" />
```

## Props

<PropsTable name="Edit" />
