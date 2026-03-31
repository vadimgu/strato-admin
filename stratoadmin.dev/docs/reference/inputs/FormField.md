# `<FormField>`

The `<FormField>` component is a wrapper that provides common form field features to its children. It is used internally by all input components to handle labels, descriptions, and error display.

## Usage

You can use `<FormField>` when building custom input components to ensure they have a consistent look and feel.

```tsx
import { FormField } from '@strato-admin/admin';

const CustomInput = (props) => (
  <FormField {...props}>
    <input type="color" />
  </FormField>
);
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="FormField" />

### `label`

The label for the field. If not provided, it's automatically generated from the `source` prop and translated. Set to `false` to hide the label.

### `description`

Secondary text to display below the label.

### `constraintText`

Additional information about the expected format of the input.

### `info`

A link to additional information, typically an `<a>` element or Cloudscape `Link`.

### `errorText`

The error message to display. If not provided, it will be automatically retrieved from the form state if the field is invalid.
