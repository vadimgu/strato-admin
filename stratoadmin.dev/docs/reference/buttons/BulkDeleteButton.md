# `<BulkDeleteButton>`

`BulkDeleteButton` deletes all currently-selected records in a `<List>`. It opens a confirmation modal before performing the deletion and is disabled when no rows are selected. It renders `null` when the resource has `canDelete: false`.

## Usage

```tsx
import { BulkDeleteButton } from '@strato-admin/cloudscape';

<List bulkActionButtons={<BulkDeleteButton />}>...</List>;
```

### Custom dialog text

Override the confirmation modal's title and body copy:

```tsx
<BulkDeleteButton
  dialogTitle="Remove products"
  dialogDescription="This will permanently remove the selected products. This action cannot be undone."
/>
```

### Custom label

The trigger button label defaults to the translated string for `strato.action.delete` ("Delete").

```tsx
<BulkDeleteButton label="Remove selected" />
```

### Mutation mode

Controls how the delete is executed relative to the server response.

```tsx
// Default: wait for server confirmation before updating the UI
<BulkDeleteButton mutationMode="pessimistic" />

// Update the UI immediately, roll back on error
<BulkDeleteButton mutationMode="optimistic" />

// Update the UI immediately and show an undo notification
<BulkDeleteButton mutationMode="undoable" />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="BulkDeleteButton" />

### `label`

**Type:** `string`
**Default:** translated `"Delete"`

Override the trigger button label.

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'normal'`

Controls the Cloudscape button style. Defaults to `normal` because bulk delete is a destructive secondary action — reserve `primary` for constructive main actions.

### `mutationMode`

**Type:** `'pessimistic' | 'optimistic' | 'undoable'`
**Default:** `'pessimistic'`

Determines when the UI updates relative to the server:

| Mode          | Behaviour                                                                       |
| ------------- | ------------------------------------------------------------------------------- |
| `pessimistic` | Waits for the server before updating the list. Safest for destructive actions.  |
| `optimistic`  | Updates the list immediately; rolls back silently on error.                     |
| `undoable`    | Updates the list immediately and shows an undo notification for a short window. |

### `dialogTitle`

**Type:** `string`
**Default:** pluralised `"Delete this item"` / `"Delete these N items"`

The confirmation modal heading. The default is automatically pluralised based on the number of selected records.

### `dialogDescription`

**Type:** `string`
**Default:** pluralised `"Are you sure you want to delete this item?"` / `"… these N items?"`

The confirmation modal body text. The default is automatically pluralised based on the number of selected records.
