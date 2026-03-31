# `<AutocompleteInput>`

The `<AutocompleteInput>` component provides an autocomplete text input field, wrapping Cloudscape's `Autosuggest` component.

## Usage

```tsx
import { AutocompleteInput } from '@strato-admin/admin';

<AutocompleteInput
  source="manufacturer"
  choices={[
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
    { id: '3', name: 'Google' },
  ]}
/>;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="AutocompleteInput" />

### `choices`

An array of objects representing the autocomplete suggestions. Each choice must have at least an `id` property.
**Example:** `[{ id: '1', name: 'Option 1' }, { id: '2', name: 'Option 2' }]`

### `placeholder`

The placeholder text to display in the input.

### `disabled`

If `true`, the input is disabled.
