---
sidebar_position: 3
title: 'Fields'
---

# Fields

Fields are the building blocks of your admin interface. They define how data is displayed in list views, detail views, and forms. Strato Admin provides a variety of field components that you can use to represent different types of data, such as text, numbers, dates, references, and more.

Each field component is mapped to a corresponding input component for forms. For example, a `TextField` will automatically use a `TextInput` in create and edit views. This allows you to define your data model and its presentation in one place, while still giving you the flexibility to customize the form inputs as needed.

## Field to Input Mapping

When a field is included in a `ResourceSchema`, Strato Admin automatically infers the corresponding form input component. The mapping is:

| Field                  | Inferred Input   | Notes                           |
| ---------------------- | ---------------- | ------------------------------- |
| `TextField`            | `TextInput`      |                                 |
| `NumberField`          | `NumberInput`    |                                 |
| `CurrencyField`        | `NumberInput`    |                                 |
| `ReferenceField`       | `ReferenceInput` |                                 |
| `ArrayField`           | `ArrayInput`     | Children are recursively mapped |
| `BooleanField`         | `BooleanInput`   | Renders a Cloudscape Toggle     |
| `DateField`            | _(none)_         | Excluded from forms by default  |
| `BadgeField`           | _(none)_         | Excluded from forms by default  |
| `StatusIndicatorField` | _(none)_         | Excluded from forms by default  |
| `IdField`              | _(none)_         | Excluded from forms by default  |
| `ReferenceManyField`   | _(none)_         | Excluded from forms by default  |

Fields with no inferred input are omitted from create and edit forms unless you explicitly provide an `input` prop.

## Common Field Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="TextField" />

## `source`

The `source` prop specifies the property name in the record that should be displayed by the field. It can also be used to infer the label if the `label` prop is not provided.

## `label`

The `label` prop allows you to specify a custom label for the field. If not provided, it will be inferred from the `source` by converting it to a human-readable format (e.g., "first_name" becomes "First Name").

## `link`

The `link` prop allows you to make the field value clickable, linking to another page. It can be set to:

- `true`: links to the 'detail' page of the current resource
- `'edit' | 'detail'`: links to the specified page type
- `string`: a custom URL
- `function`: a function that receives the record and resource and returns a URL

```tsx
<TextField source="name" link="detail" />
```

```tsx
<TextField source="name" link={(record) => `/products/${record.id}`} />
```

## `emptyText`

The `emptyText` prop allows you to specify the text to display when the field value is empty or null.

```tsx
<TextField source="description" emptyText="No description provided" />
```

## `description` and `constraintText`

The `description` prop provides additional information about the field, which is passed to the inferred Input component's FormField. The `constraintText` prop allows you to specify any constraints or validation rules for the field.

```tsx
<CurrencyField
  source="price"
  description="The price of the product in USD."
  constraintText="Must be a positive number."
/>
```

## Customizing Form Inputs

You can customize the form input for a field by passing an `input` prop with the desired input component and its props.

```tsx
<TextField source="description" input={<TextInput multiline rows={4} />} />
```

This will render a multi-line text area for the `description` field in create and edit views, while still displaying it as a regular text field in list and detail views.
