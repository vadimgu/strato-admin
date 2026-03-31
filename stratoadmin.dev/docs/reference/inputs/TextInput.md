# `<TextInput>`

The `<TextInput>` component provides a single-line text input field, wrapping Cloudscape's `Input` component.

## Usage

```tsx
import { TextInput, required } from '@strato-admin/admin';

<TextInput
  source="name"
  label="Product Name"
  validate={required()}
  description="The unique identifier for the product."
/>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="TextInput" />

### `type`

The type of the input.
**Default:** `'text'`

Supports standard HTML input types like `'email'`, `'password'`, `'tel'`, `'url'`, etc. For numeric input, use [`<NumberInput>`](./NumberInput.md).

### `placeholder`

The placeholder text to display in the input.

### `disabled`

If `true`, the input is disabled.
