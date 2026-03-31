# `<TextAreaInput>`

The `<TextAreaInput>` component provides a multi-line text input field, wrapping Cloudscape's `Textarea` component.

## Usage

```tsx
import { TextAreaInput } from '@strato-admin/admin';

<TextAreaInput
  source="description"
  label="Product Description"
  rows={4}
  placeholder="Describe the product in detail..."
/>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="TextAreaInput" />

### `rows`

The default number of rows.
**Default:** `3`

### `autoFocus`

If `true`, the textarea is automatically focused when the component is mounted.

### `disabled`

If `true`, the input is disabled.
