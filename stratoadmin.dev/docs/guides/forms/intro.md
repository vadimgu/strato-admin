---
sidebar_position: 0
---

# Create and Edit Views

Create and Edit views are used to add new records or modify existing ones. Strato Admin provides the [`<Create>`](./Create.md) and [`<Edit>`](./Edit.md) components, which handle data fetching, form state, and layout.

These components are typically used together with a form component like `<Form>`.

## Components

- **[`<Create>`](./Create.md)**: The main wrapper for creating records.
- **[`<Edit>`](./Edit.md)**: The main wrapper for editing records.
- **[`<Form>`](./Form.md)**: The form wrapper that handles submission and layout.

## Typical Structure

A Create or Edit view usually follows this structure:

1.  **Wrapper Component**: `<Create>` or `<Edit>` provide the record context and the Cloudscape container.
2.  **Form Component**: A form like `<Form>` manages the overall form state and submission.
3.  **Input Fields**: Individual inputs like `<TextInput>`, `<NumberInput>`, etc., allow users to enter data.

```tsx
import { Create, Form, TextInput, NumberInput } from '@strato-admin/admin';

const PostCreate = () => (
  <Create>
    <Form>
      <TextInput source="title" />
      <NumberInput source="views" />
    </Form>
  </Create>
);
```
