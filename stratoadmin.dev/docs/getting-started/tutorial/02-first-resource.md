# Building Your First Resource

The fastest way to build with Strato Admin is the **Schema-First** paradigm. Instead of building separate components for Lists, Forms, and Detail views, you define your data model once using `<ResourceSchema>`.

## Defining the Schema

In your `src/App.tsx`, we will add our first resource. We define the fields we want to display, and Strato Admin handles the rest.

```tsx title="src/App.tsx" showLineNumbers
import { Admin, ResourceSchema, TextField, NumberField } from '@strato-admin/admin';
import { dataProvider } from '@strato-admin/faker-ecommerce';

const App = () => (
  <Admin dataProvider={dataProvider}>
    <ResourceSchema name="products">
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="description" />
    </ResourceSchema>
  </Admin>
);

export default App;
```

### Define Once, Use Everywhere

Strato Admin uses these definitions to automatically determine how to display data and how to render forms:

- **Display:** In the **List** and **Detail** views, it renders the appropriate Field components (like a sortable table column for `name`).
- **Editing:** In **Create** and **Edit** forms, it automatically maps these fields to their corresponding Input components (e.g., `TextField` becomes a text box).

## Auto-Generated Views & Routing

Once you save the file, Strato Admin automatically generates the standard set of views and routes for your resource. For a resource named `products`, the following routes are automatically created:

| View       | Route                | Description                                   |
| :--------- | :------------------- | :-------------------------------------------- |
| **List**   | `/products`          | A table displaying all your records.          |
| **Detail** | `/products/:id`      | A read-only page for viewing a single record. |
| **Edit**   | `/products/:id/edit` | A form to modify existing records.            |
| **Create** | `/products/create`   | A form to add new records.                    |

You don't need to configure a router or define paths manually; the framework handles all navigation and history state for you, ensuring your users can always bookmark or share direct links to specific records.

In the next chapter, we'll see how to customize **Labels** to make our admin interface more human-friendly.
