---
sidebar_position: 1
---

# `<Detail>`

The `<Detail>` component is the main wrapper for displaying a single record's details. It provides the record context and a Cloudscape `Container` with a header.

## Usage

```tsx
import { Detail, KeyValuePairs, TextField, NumberField } from '@strato-admin/admin';

const ProductDetail = () => (
  <Detail>
    <KeyValuePairs>
      <TextField source="name" />
      <NumberField source="price" />
    </KeyValuePairs>
  </Detail>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="Detail" />

### `title`

The title displayed in the header. If not provided, it defaults to the resource name.

### `actions`

A React element to display in the header actions area. By default, it shows an `<EditButton>`.

### `resource`

The resource name. If not provided, it will be inferred from the current `ResourceContext`.

### `id`

The ID of the record to display. If not provided, it will be inferred from the URL.

### `queryOptions`

Options passed to the underlying `react-query` hook.
