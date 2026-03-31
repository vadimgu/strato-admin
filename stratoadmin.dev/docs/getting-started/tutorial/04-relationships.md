# Relationships: Connecting Resources

In administrative applications, data is often interconnected. Products belong to categories, and in this chapter, we will connect our "Products" resource to a new "Categories" resource.

## Adding the Categories Resource

Update `src/App.tsx` to include the categories. We will define categories as **Read-Only** and **Hidden from the Menu**, as they are managed by a central catalog team and don't need a dedicated list in our sidebar.

We will also use the `recordRepresentation` prop. This tells Strato Admin which field should be used whenever this resource is referenced (e.g., in dropdowns or breadcrumbs).

```tsx title="src/App.tsx" showLineNumbers
import { Admin, ResourceSchema, TextField, NumberField } from '@strato-admin/admin';
// highlight-next-line
import { ReferenceField } from '@strato-admin/admin';
import { dataProvider } from '@strato-admin/faker-ecommerce';

const App = () => (
  <Admin dataProvider={dataProvider}>
    <ResourceSchema name="products">
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      // highlight-start
      {/* New field, reference to categories */}
      <ReferenceField source="category_id" reference="categories" />
      // highlight-end
    </ResourceSchema>
    // highlight-start
    {/* New categories resource */}
    <ResourceSchema
      name="categories"
      recordRepresentation="name"
      list={false}
      create={false}
      edit={false}
      delete={false}
    >
      <TextField source="id" />
      <TextField source="name" />
    </ResourceSchema>
    // highlight-end
  </Admin>
);

export default App;
```

## How it Works

By adding the `ReferenceField` to the products and defining the `categories` resource, Strato Admin automatically handles the heavy lifting:

1.  **Record Representation:** By setting `recordRepresentation="name"`, we explicitly tell the framework to use the `name` field whenever a category needs to be displayed as text.
2.  **Automatic Data Fetching:** In the Product List, the framework automatically fetches the related category and displays its name instead of a cryptic ID.
3.  **Navigation:** In List and Detail Views, the `ReferenceField` automatically renders as a link to the referenced record's detail page, making it easy to navigate through your data graph.
4.  **Searchable Inputs:** In the Create and Edit forms, it automatically renders a searchable dropdown (ReferenceInput) allowing you to pick a category.
5.  **Optional Reference-Only State:** In this example, we set `list={false}` to hide "Categories" from the sidebar, and disabled mutations (`create={false}`, etc.) to make it **read-only**. This is useful for auxiliary data, but it is **entirely optional**. A resource can be fully active, with its own list and edit forms, and still be used as a reference for other resources.

:::tip[No N+1 Problem]
A common performance issue when displaying lists with related records is the "N+1 Problem," where one extra database request is made for every single item in the list.

Strato Admin (via the React Admin core) avoids this by **batching**. When rendering a list of 50 products, it doesn't make 50 requests for categories. Instead, it collects all unique category IDs and makes a single request (`getMany`) to fetch them all at once.
:::

## The Schema-First Advantage

This is the power of the schema-first approach: **you define the relationship once**. Strato Admin uses that single line of code to determine how to fetch the data, how to display it in a table, and how to build the selection UI in a form.

## Summary

In this chapter, we:

- Created a relationship between two resources.
- Configured a resource to be "Reference-only" by hiding it from the menu and disabling mutations.
- Saw how `ReferenceField` provides both human-readable labels and searchable inputs.

In the next chapter, we will learn how to customize our list view to handle larger datasets and better layouts.
