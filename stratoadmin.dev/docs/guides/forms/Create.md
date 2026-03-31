---
sidebar_position: 1
---

# `<Create>`

The `<Create>` component is the main wrapper for creating new records. It provides the record context, sets up the form, and renders a Cloudscape `Container` with a header.

## Usage

```tsx
import { Create, Form, TextInput, NumberInput } from '@strato-admin/admin';

const ProductCreate = () => (
  <Create>
    <Form>
      <TextInput source="name" />
      <NumberInput source="price" />
    </Form>
  </Create>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Create" />

### `title`

The title displayed in the header. If not provided, it defaults to the resource name (singular).

### `actions`

A React element to display in the header actions area.

### `resource`

The resource name. If not provided, it will be inferred from the current `ResourceContext`.

### `record`

Initial values for the record to be created.

### `redirect`

The location to redirect to after a successful creation. Defaults to `edit`.

### `transform`

A function to transform the record before it's sent to the data provider.

### `mutationOptions`

Options passed to the underlying `react-query` mutation hook.
