# `<KeyValuePairs>`

The `<KeyValuePairs>` component displays record data as a series of labels and values, wrapping Cloudscape's `KeyValuePairs` component. It automatically handles labels (using `FieldTitle`) and provides `RecordContext` to its children.

## Usage

For most cases, you can use field components like `<TextField>` or `<NumberField>` directly inside `<KeyValuePairs>`. It will automatically extract the `source` and `label` props to create the key-value pairs.

```tsx
import { Show, KeyValuePairs, TextField, NumberField, DateField } from '@strato-admin/admin';

const ProductShow = () => (
  <Show>
    <KeyValuePairs columns={2}>
      <TextField source="name" label="Product Name" />
      <NumberField source="price" label="Price" />
      <DateField source="createdAt" label="Created At" />
    </KeyValuePairs>
  </Show>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="KeyValuePairs" />

### `columns`

The number of columns to display.
**Default:** `3`

### `minColumnWidth`

The minimum width of each column in pixels.

## `KeyValuePairs.Field`

While you can usually use field components directly, `KeyValuePairs.Field` is a helper component provided for more complex scenarios. There are three primary use cases for using it:

### 1. Custom Rendering (Non-Field Components)
When you want to render custom content that isn't a standard Field component, `KeyValuePairs.Field` allows you to define a label and source without passing those props to the underlying HTML.

```tsx
<KeyValuePairs.Field label="Custom Info" source="metadata">
  <div>
    <p>This is a custom layout that doesn't use standard fields.</p>
  </div>
</KeyValuePairs.Field>
```

### 2. Symmetry with `Table.Column`
For developers who prefer a consistent declarative pattern across the library, `KeyValuePairs.Field` provides a similar experience to `Table.Column`.

```tsx
<KeyValuePairs>
  <KeyValuePairs.Field source="id" />
  <KeyValuePairs.Field source="name" />
</KeyValuePairs>
```

### 3. Dynamic Field Selection
The `field` prop allows you to dynamically choose which field component to render based on logic, while still benefiting from the automatic label handling of the parent.

```tsx
<KeyValuePairs.Field 
  source="status" 
  field={isSpecial ? SpecialStatusField : NormalStatusField} 
/>
```

### Props for `KeyValuePairs.Field`

#### `source`
The field name to use for generating the label.

#### `label`
Override the label for the field.

#### `children`
The custom content to render as the value.

#### `field`
A component type to use for rendering the value.
