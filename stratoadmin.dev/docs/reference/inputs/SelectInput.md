# `<SelectInput>`

The `<SelectInput>` component provides a dropdown selection, wrapping Cloudscape's `Select` component.

## Usage

```tsx
import { SelectInput } from '@strato-admin/admin';

<SelectInput
  source="category"
  choices={[
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
  ]}
/>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="SelectInput" />

### `choices`

An array of objects representing the selection options. Each choice must have at least an `id` property.
**Example:** `[{ id: '1', name: 'Option 1' }, { id: '2', name: 'Option 2' }]`

The display label for each choice is determined by the `getRecordRepresentation` function, which defaults to the `name` property.

### `placeholder`

The placeholder text to display when no option is selected.

### `disabled`

If `true`, the selection is disabled.
