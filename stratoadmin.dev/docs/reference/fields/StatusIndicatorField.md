---
sidebar_position: 8
---

# `<StatusIndicatorField>`

Displays a field value as a Cloudscape `StatusIndicator` with an icon and optional label. Supports mapping field values to indicator types declaratively or via a lookup object.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<StatusIndicatorField source="status" />
```

### Declarative Mapping with `StatusIndicatorLabel`

Use `StatusIndicatorField.Label` children to map individual values to indicator types and custom labels.

```tsx
<StatusIndicatorField source="status">
  <StatusIndicatorField.Label value="active" type="success" label="Active" />
  <StatusIndicatorField.Label value="pending" type="pending" label="Pending" />
  <StatusIndicatorField.Label value="error" type="error" label="Error" />
</StatusIndicatorField>
```

### Mapping via Object

Pass a `mapping` object to map values to indicator types without JSX children.

```tsx
<StatusIndicatorField source="status" mapping={{ active: 'success', pending: 'pending', error: 'error' }} />
```

### Dynamic Type via Function

Use a function for `type` when the indicator type depends on runtime logic.

```tsx
<StatusIndicatorField source="score" type={(value) => (value >= 80 ? 'success' : value >= 50 ? 'warning' : 'error')} />
```

### Fixed Type

If all values should share the same indicator type, pass a string directly.

```tsx
<StatusIndicatorField source="note" type="info" />
```

## Props

<PropsTable name="StatusIndicatorField" />
