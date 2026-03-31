# `<NumberInput>`

The `<NumberInput>` component provides a numeric input field, wrapping Cloudscape's `Input` component with `type="number"`. It ensures that values are correctly handled as numbers in the form state.

## Usage

```tsx
import { NumberInput, required } from '@strato-admin/admin';

<NumberInput source="price" label="Product Price" validate={required()} step={0.01} />;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="NumberInput" />

### `step`

The step value for the numeric input.
**Default:** `1`

### `disabled`

If `true`, the input is disabled.
