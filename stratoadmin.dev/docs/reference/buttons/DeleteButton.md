# `<DeleteButton>`

`DeleteButton` deletes the current record after showing a confirmation modal. It is included in the default header of `<Edit>` views and renders `null` when the resource has `canDelete: false`.

For deleting multiple selected records in a list, see [`<BulkDeleteButton>`](./BulkDeleteButton.md).

## Usage

```tsx
import { DeleteButton } from '@strato-admin/cloudscape';

// Already included in <Edit> headers by default
<Edit actions={<DeleteButton />}>
  ...
</Edit>
```

### Custom dialog text

Override the confirmation modal's title and body copy:

```tsx
<DeleteButton
  dialogTitle="Remove this product"
  dialogDescription="This will permanently remove the product. This action cannot be undone."
/>
```

### Custom label

The button label defaults to the translated string for `strato.action.delete` ("Delete").

```tsx
<DeleteButton label="Remove" />
```

### Mutation mode

Controls how the delete is executed relative to the server response.

```tsx
// Default: wait for server confirmation before redirecting
<DeleteButton mutationMode="pessimistic" />

// Update the UI immediately, roll back on error
<DeleteButton mutationMode="optimistic" />

// Redirect immediately and show an undo notification
<DeleteButton mutationMode="undoable" />
```

### Custom redirect

After deletion the user is redirected to the resource list by default. Pass a different path to override:

```tsx
<DeleteButton redirect="/dashboard" />
```

### Passing a record explicitly

When rendered outside a record context, pass the record directly:

```tsx
<DeleteButton record={product} />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="DeleteButton" />

### `record`

**Type:** `RaRecord`
**Default:** record from the current record context

The record to delete. When omitted, the record is read from the current record context.

### `label`

**Type:** `string`
**Default:** translated `"Delete"`

Override the trigger button label.

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'normal'`

Controls the Cloudscape button style. Defaults to `normal` because deletion is a destructive secondary action.

### `mutationMode`

**Type:** `'pessimistic' | 'optimistic' | 'undoable'`
**Default:** `'pessimistic'`

Determines when the UI updates relative to the server:

| Mode | Behaviour |
|---|---|
| `pessimistic` | Waits for the server before redirecting. Safest for destructive actions. |
| `optimistic` | Redirects immediately; rolls back silently on error. |
| `undoable` | Redirects immediately and shows an undo notification for a short window. |

### `redirect`

**Type:** `string`
**Default:** `'list'`

The path to navigate to after a successful deletion. Defaults to the resource list.

### `dialogTitle`

**Type:** `string`
**Default:** `"Delete this item"`

The confirmation modal heading.

### `dialogDescription`

**Type:** `string`
**Default:** `"Are you sure you want to delete this item?"`

The confirmation modal body text.
