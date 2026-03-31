---
sidebar_position: 2
title: '<ResourceSchema>'
---

# `<ResourceSchema>`

The `<ResourceSchema>` component is a declarative way to define your data model and UI behavior in one place. It acts as a single source of truth for a resource, centralizing field definitions, validation rules, and visibility settings.

By using `<ResourceSchema>`, you enable the framework to automatically infer the UI for the entire **Resource Lifecycle**, including **List Views**, **Detail Views**, and **Forms**. This significantly reduces boilerplate and ensures consistency across your application.

## Defining the Data Model

The primary way to use `<ResourceSchema>` is by passing field components as `children`. These fields define both the data structure and how that data should be presented.

```tsx
import { ResourceSchema, TextField, CurrencyField } from '@strato-admin/admin';

<ResourceSchema name="products">
  <TextField source="reference" isRequired />
  <TextField source="name" isRequired />
  <CurrencyField source="price" currency="USD" />
</ResourceSchema>;
```

## What Gets Generated

A single `<ResourceSchema>` definition produces four views automatically:

| View   | Route                | Description                          |
| :----- | :------------------- | :----------------------------------- |
| List   | `/products`          | Table of all records with pagination |
| Detail | `/products/:id`      | Read-only view of a single record    |
| Create | `/products/create`   | Form to create a new record          |
| Edit   | `/products/:id/edit` | Form to edit an existing record      |

All four views derive their field definitions from the same `<ResourceSchema>` children. Change a field label once and it updates everywhere.

## Field to Input Inference

Fields drive both the read views and the form inputs. When the framework encounters a `<TextField>`, it automatically renders a `<TextInput>` in Create and Edit forms — you don't need to define form inputs separately.

Props on the field flow through to the inferred input:

```tsx
<ResourceSchema name="products">
  {/* isRequired → adds required validation to the form input */}
  {/* description → shown as help text below the form field */}
  <TextField source="name" isRequired description="The public-facing product name" />

  {/* input={false} → excluded from all forms */}
  <TextField source="sku" input={false} />

  {/* input prop → override the inferred input entirely */}
  <TextField source="status" input={<SelectInput choices={statusChoices} />} />
</ResourceSchema>
```

See [Field to Input Mapping](/docs/reference/inputs) for the full mapping table.

## When You Need More Control

The schema is a starting point, not a constraint. There are three levels of customization:

**Schema props** — control visibility and layout without leaving the schema. Use props like `listExclude`, `detailTitle`, or `formInclude` to adjust what appears where.

```tsx
<ResourceSchema name="products" listExclude={['description']} detailTitle="Product: {name}">
  {/* fields */}
</ResourceSchema>
```

**View override** — replace a generated view with your own component while keeping the schema context for the other views.

```tsx
<ResourceSchema name="products" list={MyCustomList}>
  {/* fields still power Detail, Create, and Edit */}
</ResourceSchema>
```

**Headless** — drop down to React hooks and build completely custom UI.

For the full list of props, see the [`<ResourceSchema>` Reference](/docs/reference/ResourceSchema).
