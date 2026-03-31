---
sidebar_position: 3
---

# `<IdField>`

Displays a record's ID field. By default it links to the record's detail page (if one exists) and is hidden in forms.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<IdField />
```

### Custom Source

If your resource uses a different field for its identifier, override `source`.

```tsx
<IdField source="uuid" />
```

## Props

Accepts the same props as [`<TextField>`](./TextField.md). Defaults:
- `source` → `"id"`
- `link` → `"detail"` (if the resource has a detail page, otherwise no link)
- `input` → `false` (hidden in create/edit forms)

<PropsTable name="IdField" />
