---
sidebar_position: 2
---

# `<TextField>`

The most basic field, it displays a property of a record as a simple string. It uses the Cloudscape Link component if the `link` prop is provided.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<TextField source="name" />
```

### Linking

You can easily link a text field to a record's edit or show page.

```tsx
// Link to the edit page of the current record
<TextField source="name" link="edit" />

// Custom link
<TextField source="name" link={(record) => `/custom/path/${record.id}`} />
```

## Props

<PropsTable name="TextField" />
