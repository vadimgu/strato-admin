# `<EditButton>`

`EditButton` navigates to the edit page for a specific record. It reads the record from the current record context (e.g. inside a `<Table>` row or a `<Detail>` view). Returns `null` when no record is available.

## Usage

```tsx
import { EditButton } from '@strato-admin/cloudscape';

// Inside a Table row — record is inferred from context
<Table rowActions={(record) => <EditButton record={record} />} />;
```

In a detail view the record comes from context automatically:

```tsx
<Detail actions={<EditButton />}>...</Detail>
```

### Custom label

The button label defaults to the translated string for `strato.action.edit` ("Edit").

```tsx
<EditButton label="Edit product" />
```

### Changing the variant

`EditButton` defaults to `normal`. Pass `variant="primary"` when it is the sole action in a header:

```tsx
<EditButton variant="primary" />
```

### Passing a record explicitly

When rendered outside a record context, pass the record directly:

```tsx
<EditButton record={product} />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="EditButton" />

### `record`

**Type:** `RaRecord`
**Default:** record from the current record context

The record to edit. When omitted, the record is read from the current record context. The button renders `null` if no record is found.

### `label`

**Type:** `string`
**Default:** translated `"Edit"`

Override the button label.

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'normal'`

Controls the Cloudscape button style. Defaults to `normal` so it remains a secondary action when placed alongside other buttons (e.g. `DeleteButton` in an edit header). The `<DetailHeader>` passes `variant="primary"` explicitly since `EditButton` is the sole action there.
