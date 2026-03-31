# `<AttributeEditor>`

The `<AttributeEditor>` component allows users to manage a list of complex objects, wrapping Cloudscape's `AttributeEditor`. Each item in the list can have multiple fields.

## Usage

```tsx
import { AttributeEditor, TextInput, NumberInput } from '@strato-admin/admin';

<AttributeEditor source="items" addButtonText="Add new item">
  <TextInput source="name" label="Item Name" />
  <NumberInput source="quantity" label="Quantity" />
  <NumberInput source="price" label="Price" />
</AttributeEditor>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="AttributeEditor" />

### `source`

The name of the array field in the form state.

### `children`

Input components to be rendered for each item in the list. Each child should have its own `source` relative to the item object.

### `addButtonText`

The text to display on the "Add item" button.
**Default:** `'Add item'`

### `removeButtonText`

The text to display on the "Remove item" button for each item.
**Default:** `'Remove item'`

### `empty`

Custom content to display when there are no items in the list.

### `disableAddButton`

If `true`, the "Add item" button is disabled.

### `hideAddButton`

If `true`, the "Add item" button is hidden.

## `<AttributeEditor.Item>`

A helper component to define custom fields in the editor, allowing for more advanced rendering while still benefiting from automatic state management.

### `source`

The field name relative to the current item object.

### `label`

The label for the field.

### `children`

Custom content to render for the field value.
