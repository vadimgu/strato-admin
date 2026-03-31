---
sidebar_position: 10
---

# `<ReferenceField>`

Fetches a related record and displays its representation. It manages the data fetching automatically and provides a link to the related record by default.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<ReferenceField source="userId" reference="users" />
```

### Custom Child

By default, it uses the `recordRepresentation` defined in the resource. You can pass a child component to customize what is displayed for the related record.

```tsx
<ReferenceField source="categoryId" reference="categories">
  <TextField source="slug" />
</ReferenceField>
```

## Props

<PropsTable name="ReferenceField" />
