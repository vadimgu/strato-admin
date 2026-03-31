# `<ReferenceInput>`

The `<ReferenceInput>` component allows you to select a record from a related resource. It acts as a wrapper for other input components (like `<SelectInput>` or `<AutocompleteInput>`) to provide them with the appropriate choices from the referenced resource.

## Usage

```tsx
import { ReferenceInput, SelectInput, AutocompleteInput } from '@strato-admin/admin';

// Using with SelectInput
<ReferenceInput source="category_id" reference="categories">
    <SelectInput />
</ReferenceInput>

// Using with AutocompleteInput
<ReferenceInput source="author_id" reference="authors">
    <AutocompleteInput />
</ReferenceInput>
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="ReferenceInput" />

### `source`

The field in the current resource that stores the ID of the referenced record.

### `reference`

The name of the related resource to fetch choices from.

### `children`

An input component that will render the choices (typically `<SelectInput>` or `<AutocompleteInput>`). The child component will automatically receive the `choices` and `isPending` state from `<ReferenceInput>`.

### `filter`

Permanent filters to apply when fetching the referenced records.
**Example:** `filter={{ is_active: true }}`

### `sort`

The default sort order for the referenced records.
**Example:** `sort={{ field: 'name', order: 'ASC' }}`

### `perPage`

The number of records to fetch for selection.
**Default:** `25`
