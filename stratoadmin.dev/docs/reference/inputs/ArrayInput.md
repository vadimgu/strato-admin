# `<ArrayInput>`

The `<ArrayInput>` component lets users manage a list of structured items in a form, wrapping Cloudscape's `AttributeEditor`. Each item can contain multiple fields defined as children.

## Usage

```tsx
import { ArrayInput, TextInput, NumberInput } from '@strato-admin/admin';

<ArrayInput source="variants" label="Variants">
  <TextInput source="sku" label="SKU" />
  <TextInput source="color" label="Color" />
  <NumberInput source="stock" label="Stock" />
</ArrayInput>
```

Each child input defines one column in the editor. The `source` on each child is relative to the item object (e.g., for an item at index 2, `sku` becomes `variants.2.sku` internally).

## Usage in `ResourceSchema`

`<ArrayInput>` is the default input inferred when an `<ArrayField>` is used in a `ResourceSchema`. To customize it, pass it explicitly via the `input` prop:

```tsx
<ArrayField source="items" label="Items">
  <ReferenceField source="product_id" reference="products" label="Product" isRequired />
  <NumberField source="quantity" label="Quantity" isRequired />
</ArrayField>
```

With a custom grid layout:

```tsx
<ArrayField
  source="items"
  label="Items"
  input={<ArrayInput gridLayout={[{ rows: [[3, 1]] }]} />}
>
  <ReferenceField source="product_id" reference="products" label="Product" isRequired />
  <NumberField source="quantity" label="Quantity" isRequired />
</ArrayField>
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="ArrayInput" />

### `source`

The field name in the record that holds the array.

### `children`

Input components that define the columns for each item. Each child must have a `source` relative to the item object. You can use any standard input (`<TextInput>`, `<NumberInput>`, `<SelectInput>`, etc.) or the `<ArrayInput.Item>` helper for custom rendering.

### `addButtonText`

The label for the button that adds a new item.
**Default:** `'Add item'`

### `removeButtonText`

The label for the remove button shown on each item row.
**Default:** `'Remove item'`

### `empty`

Custom content displayed when the array is empty.
**Default:** `'No items added yet.'`

### `disableAddButton`

If `true`, the add button is rendered but non-interactive.

### `hideAddButton`

If `true`, the add button is not rendered at all.

### `gridLayout`

Controls the column widths of the editor using Cloudscape's `AttributeEditor` grid layout format.

**Example:** `gridLayout={[{ rows: [[3, 1]] }]}` — renders two columns with a 3:1 width ratio.

See the [Cloudscape AttributeEditor docs](https://cloudscape.design/components/attribute-editor/) for the full `gridLayout` specification.

### `defaultValue`

The initial array value when the record has no value for this field.

### `validate`

Validation rules applied to the array as a whole.

## `<ArrayInput.Item>`

A helper for defining a column with custom rendering or a custom input component.

```tsx
<ArrayInput source="links">
  <ArrayInput.Item source="url" label="URL" field={TextInput} />
  <ArrayInput.Item source="label" label="Label">
    <TextInput placeholder="Optional label" />
  </ArrayInput.Item>
</ArrayInput>
```

### `source`

The field name relative to the item object.

### `label`

The column header label.

### `field`

A component class to use as the input. Receives `source`, `label={false}`, `validate`, and `defaultValue`.

### `children`

Alternatively, pass JSX directly for fully custom rendering.

### `validate`

Validation rules for this field.

### `defaultValue`

Default value for this field when a new item is appended.
