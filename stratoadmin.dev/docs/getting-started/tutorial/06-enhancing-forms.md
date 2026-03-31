# Enhancing Form Inputs

In previous chapters, we optimized our list view. Now, we will learn how to customize the **Create Form** and **Edit Form** that Strato Admin generates for us. We will explore how to use different input components to improve the data entry experience.

## Customizing Input Components

By default, Strato Admin maps each field in your schema to a default input component (e.g., `TextField` becomes a `TextInput`). You can override this behavior using the `input` prop on any field within your `<ResourceSchema>`.

The `input` prop is a slot that accepts any component of type **Input**.

### Using a Text Area for Descriptions

For our product's `description`, a single line of text is often not enough. We can use the `TextAreaInput` component to provide a multi-line input field.

### Adding a Status Select

We will also add a `status` field to our products. This is a perfect candidate for a `SelectInput`, which allows users to pick from a fixed set of options.

Update `src/App.tsx` with these enhancements:

```tsx title="src/App.tsx"
import { 
  Admin, 
  ResourceSchema, 
  TextField, 
  NumberField, 
  ReferenceField,
  TextAreaInput,
  SelectInput,
} from "@strato-admin/admin";
import { dataProvider } from "@strato-admin/faker-ecommerce";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <ResourceSchema
      name="products"
      listInclude={["name", "price", "category_id", "status"]}
    >
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      
      {/* Customize the description to use a multi-line text area */}
      <TextField 
        source="description" 
        input={<TextAreaInput />} 
      />
      
      {/* Add a status field with a searchable dropdown select */}
      <TextField
        source="status"
        input={
          <SelectInput
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
              { label: "Archived", value: "archived" },
            ]}
          />
        }
      />
      
      <ReferenceField source="category_id" reference="categories" />
    </ResourceSchema>

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
  </Admin>
);
```

## How it Works

1.  **Direct Mapping:** When you provide an `input` prop, Strato Admin uses it directly in the **Create** and **Edit** forms instead of the default mapping.
2.  **Schema Synergy:** The same `<TextField>` is still used for display in the **List** and **Detail** views, but its editing behavior is now customized.
3.  **Layout Consistency:** These inputs are automatically wrapped in a Cloudscape `FormField`, handling labels, descriptions, and validation errors consistently across your entire application.

## Summary

In this chapter, we've seen how to:
- Override default input components using the `input` prop.
- Improve the data entry experience with `TextAreaInput` and `SelectInput`.
- Maintain a single source of truth for both display and form views.

## Next Steps

Now that our forms are polished, in the next chapter we will wrap our resources in a professional **App Shell** with custom navigation and branding.
