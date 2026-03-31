---
sidebar_position: 1
---

# `<Admin>`

The `<Admin>` component is the root component of a Strato Admin application. It sets up the context for data fetching, authentication, internationalization, and routing.

## Usage

```tsx
import { Admin, ResourceSchema, TextField, IdField } from '@strato-admin/admin';
import { dataProvider } from './dataProvider';

const App = () => (
  <Admin dataProvider={dataProvider} title="My Admin">
    <ResourceSchema name="posts">
      <IdField source="id" />
      <TextField source="title" isRequired link="detail" />
      <TextField source="body" />
    </ResourceSchema>
  </Admin>
);
```

For a full reference of all props, see [`<Admin>` Reference](../reference/Admin.md).
