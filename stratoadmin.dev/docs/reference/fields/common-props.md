---
sidebar_position: 1
---

# Common Field Props

All field components share a common set of props. These are defined in `FieldProps` and accepted by every field in Strato Admin.

## Common Props

All field components accept these props.

### `source`

The property path in the record to display.

```tsx
<TextField source="name" />
<TextField source="address.city" />
```

### `label`

The column header or form label for the field. If omitted, it is inferred from `source` (e.g. `"firstName"` → `"First name"`).

```tsx
<TextField source="firstName" label="Given name" />
```

### `link`

Wraps the displayed value in a Cloudscape `Link`. Accepts:

| Value | Behavior |
|---|---|
| `true` | Links to the record's detail page |
| `"detail"` | Links to the record's detail page |
| `"edit"` | Links to the record's edit page |
| `(record, resource) => string` | Custom URL from a function |

```tsx
<TextField source="name" link="detail" />
<TextField source="name" link={(record) => `/custom/${record.id}`} />
```

### `emptyText`

Text (or element) to render when the field value is `null`, `undefined`, or an empty string.

```tsx
<TextField source="nickname" emptyText="—" />
```

### `sortable`

Whether the column is sortable when rendered in a table. Defaults to `true`.

```tsx
<TextField source="name" sortable={false} />
```

## Form Input Props

These props control how the field's auto-inferred form input behaves in create/edit forms.

### `input`

Controls the inferred input component for this field. Accepts:

| Value | Behavior |
|---|---|
| Object | Extra props merged into the inferred input |
| `ReactElement` | Replaces the inferred input entirely |
| `false` | Excludes the field from all forms |

```tsx
// Pass extra props to the inferred input
<TextField source="slug" input={{ disabled: true }} />

// Use a completely different input
<TextField source="body" input={<TextareaInput />} />

// Hide from forms (e.g. system-managed fields)
<TextField source="createdAt" input={false} />
```

### `isRequired`

Marks the field as required. Adds validation to the inferred form input and may show a required indicator.

```tsx
<TextField source="name" isRequired />
```

### `description`

Help text shown below the input in forms.

```tsx
<TextField source="slug" description="Used in the URL. Lowercase letters and hyphens only." />
```

### `constraintText`

Constraint text shown below the input in forms, typically describing allowed values.

```tsx
<NumberField source="stock" constraintText="Must be 0 or greater." />
```
