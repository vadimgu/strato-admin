---
sidebar_position: 2
---

# `<Edit>`

The `<Edit>` component is the main wrapper for editing existing records. It fetches the record, provides the record context, sets up the form, and renders a Cloudscape `Container` with a header.

## Usage

```tsx
import { Edit, Form, TextInput, NumberInput } from '@strato-admin/admin';

const ProductEdit = () => (
  <Edit>
    <Form>
      <TextInput source="name" />
      <NumberInput source="price" />
    </Form>
  </Edit>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Edit" />

### `title`

The title displayed in the header. If not provided, it defaults to the resource name (singular).

### `actions`

A React element to display in the header actions area.

### `resource`

The resource name. If not provided, it will be inferred from the current `ResourceContext`.

### `id`

The ID of the record to edit. If not provided, it will be inferred from the URL.

### `mutationMode`

The mutation mode to use for updates: `pessimistic`, `optimistic`, or `undoable`. Defaults to `pessimistic`.

### `redirect`

The location to redirect to after a successful update. Defaults to `list`.

### `transform`

A function to transform the record before it's sent to the data provider.

### `queryOptions`

Options passed to the underlying `react-query` fetch hook.

### `mutationOptions`

Options passed to the underlying `react-query` mutation hook.
