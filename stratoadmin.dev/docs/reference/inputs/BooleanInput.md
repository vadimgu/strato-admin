# `<BooleanInput>`

The `<BooleanInput>` component provides a toggle switch for boolean values, wrapping Cloudscape's `Toggle` component.

## Usage

```tsx
import { BooleanInput } from '@strato-admin/admin';

<BooleanInput source="is_published" label="Published">
  Enable publishing
</BooleanInput>;
```

The text passed as `children` appears as the inline label next to the toggle — distinct from the `label` prop, which renders above the field as the form field label.

## Usage in `ResourceSchema`

`<BooleanInput>` is the default input inferred when a `<BooleanField>` is used in a `ResourceSchema`:

```tsx
<ResourceSchema name="products" recordRepresentation="name">
  <BooleanField source="is_featured" label="Featured" />
</ResourceSchema>
```

You can also supply it explicitly via the `input` prop:

```tsx
<BooleanField source="is_active" label="Active" input={<BooleanInput>Enabled</BooleanInput>} />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="BooleanInput" />

### `source`

The field name in the record that this input reads and writes.

### `label`

The label displayed above the toggle in the form field wrapper. Pass `false` to suppress the label.

### `children`

Text or elements rendered as the inline label next to the toggle switch itself.

### `defaultValue`

The initial value when the record has no value for this field.
**Default:** `false`

### `validate`

Validation rules. Accepts a single validator or an array of validators.
**Example:** `validate={required()}`

### `disabled`

If `true`, the toggle is non-interactive.
