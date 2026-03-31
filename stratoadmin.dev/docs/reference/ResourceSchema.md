# `<ResourceSchema>`

## Props

| Prop                | Type               | Default       | Description                                                                                         |
| :------------------ | :----------------- | :------------ | :-------------------------------------------------------------------------------------------------- |
| `name`              | `string`           |               | **Required**. The unique identifier for the resource (e.g., "products").                            |
| `children`          | `ReactNode`        |               | Field components (e.g., `<TextField>`) that define the data model.                                  |
| `list`              | `Component\|false` | `<List>`      | Override the default List View with a custom component or disable it with `false`.                  |
| `edit`              | `Component\|false` | `<Edit>`      | Override the default Edit Form with a custom component or disable it with `false`.                  |
| `create`            | `Component\|false` | `<Create>`    | Override the default Create Form with a custom component or disable it with `false`.                |
| `detail`            | `Component\|false` | `<Detail>`    | Override the default Detail View with a custom component or disable it with `false`.                |
| `listComponent`     | `Component`        | `<Table>`     | Custom component to use for the List View. Must be schema-aware to utilize the field definitions.   |
| `detailComponent`   | `Component`        | `<DetailHub>` | Custom component to use for the Detail View. Must be schema-aware to utilize the field definitions. |
| `listTitle`         | `ReactNode`        |               | Custom title for the **List View**.                                                                 |
| `listDescription`   | `ReactNode`        |               | Custom description for the **List View**.                                                           |
| `listInclude`       | `string[]`         |               | Fields to include in the **List View**.                                                             |
| `listExclude`       | `string[]`         |               | Fields to hide from the **List View**.                                                              |
| `listDisplay`       | `string[]`         |               | Fields to display by default in the **List View** table.                                            |
| `defaultSort`       | `SortObject`       |               | The initial sort order for the resource.                                                            |
| `perPage`           | `number`           |               | Number of items to display per page (default: 10).                                                  |
| `defaultFilters`    | `any`              |               | Permanent filters applied to all data fetching for this resource.                                   |
| `detailTitle`       | `ReactNode \| fn`  |               | Custom title for the **Detail View**. String values support ICU variables from the record (e.g. `"Product: {name}"`). |
| `detailDescription` | `ReactNode \| fn`  |               | Custom description for the **Detail View**. String values support ICU variables from the record.    |
| `detailInclude`     | `string[]`         |               | Fields to include in the **Detail View**.                                                           |
| `detailExclude`     | `string[]`         |               | Fields to hide from the **Detail View**.                                                            |
| `editTitle`         | `ReactNode \| fn`  |               | Custom title for the **Edit Form**. String values support ICU variables from the record (e.g. `"Edit Product - {name}"`). |
| `editDescription`   | `ReactNode \| fn`  |               | Custom description for the **Edit Form**. String values support ICU variables from the record.      |
| `formInclude`       | `string[]`         |               | Fields to include in both **Create** and **Edit Forms** (shared fallback).                          |
| `formExclude`       | `string[]`         |               | Fields to exclude from both **Create** and **Edit Forms** (shared fallback).                        |
| `editInclude`       | `string[]`         |               | Fields to include in the **Edit Form** (takes priority over `formInclude`).                         |
| `editExclude`       | `string[]`         |               | Fields to exclude from the **Edit Form** (takes priority over `formExclude`).                       |
| `createInclude`     | `string[]`         |               | Fields to include in the **Create Form** (takes priority over `formInclude`).                       |
| `createExclude`     | `string[]`         |               | Fields to exclude from the **Create Form** (takes priority over `formExclude`).                     |
| `createTitle`       | `ReactNode`        |               | Custom title for the **Create Form**.                                                               |
| `createDescription` | `ReactNode`        |               | Custom description for the **Create Form**.                                                         |
| `delete`            | `boolean`          | `true`        | Set to `false` to disable delete functionality for this resource.                                   |
| `queryOptions`      | `object`           |               | Options passed to the data provider for all queries (e.g., `meta: { embed: ['category'] }`).        |

---

## `list`

By default, the List View is generated automatically based on the defined fields. You can disable it or replace it with a custom component.

Set `list={false}` to hide the resource from the sidebar and prevent access to the list page, while still allowing access to the Detail, Create, and Edit views. The resource can still be used as a reference in other resources.

```tsx
<ResourceSchema name="products" list={false}>
  {/* fields */}
</ResourceSchema>
```

To use a custom list component while still benefiting from the schema context:

```tsx
<ResourceSchema name="products" list={MyCustomList}>
  {/* schema definition */}
</ResourceSchema>
```

## `edit`

Disable the Edit Form with `edit={false}` or provide a custom component. If you disable the Edit Form, the Edit button will be hidden from the Detail View, but the Create Form and List View will still be accessible.

## `create`

Disable the Create Form with `create={false}` or provide a custom component. If you disable the Create Form, the "Create" button will be hidden from the List View, but the Edit Form and Detail View will still be accessible.

## `detail`

Disable the Detail View with `detail={false}` or provide a custom component. If you disable the Detail View, the fields that link to the detail page will no longer be clickable.

## `delete`

Set `delete={false}` to remove delete functionality from this resource. This hides the delete button from both the Detail View and the Edit Form.

```tsx
<ResourceSchema name="products" delete={false}>
  {/* fields */}
</ResourceSchema>
```

## `queryOptions`

Options passed to the data provider for **all queries** made against this resource. Useful for passing `meta` parameters to REST APIs, such as embedding related resources.

```tsx
<ResourceSchema name="products" queryOptions={{ meta: { embed: ['category'] } }}>
  <TextField source="id" />
  <TextField source="name" />
  <ReferenceField source="categoryId" reference="categories" />
</ResourceSchema>
```

The `queryOptions` value is forwarded to every `getList`, `getOne`, and `getMany` call made by schema-aware components for this resource.

## `listComponent`

By default, the List View uses a `<Table>` component that is aware of the fields defined in the schema. You can provide other schema-aware components like `<Cards>` or a custom component.

```tsx
<ResourceSchema name="products" listComponent={Cards}>
  <TextField source="id" />
  <TextField source="name" />
</ResourceSchema>
```

## `detailComponent`

The Detail View defaults to a `<DetailHub>` that organizes fields in 3 columns. You can override this with any schema-aware component.

```tsx
const MyDetailHub2 = (props) => {
  const { children, columns: _, ...rest } = props;
  return (
    <DetailHub columns={2} {...rest}>
      {children}
    </DetailHub>
  );
};

<ResourceSchema name="products" detailComponent={MyDetailHub2}>
  <TextField source="id" />
  <TextField source="name" />
</ResourceSchema>;
```

## `defaultSort`

Defines the default sorting for the **List View**.

```tsx
<ResourceSchema name="products" defaultSort={{ field: 'createdAt', order: 'DESC' }}>
  <TextField source="id" />
  <TextField source="name" />
  <DateField source="createdAt" />
</ResourceSchema>
```

Honored by all schema-aware collection components: `<Table>`, `<Cards>`, `<ReferenceInput>`, etc.

## `perPage`

Sets the default number of items per page in the **List View**.

```tsx
<ResourceSchema name="products" perPage={25}>
  <TextField source="id" />
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
</ResourceSchema>
```

## `defaultFilters`

Applies permanent filters to all data fetching for this resource. Applied to all schema-aware collection components including `<Table>`, `<Cards>`, and `<ReferenceInput>`.

```tsx
<ResourceSchema name="products" defaultFilters={{ status: 'active' }}>
  <TextField source="id" />
  <TextField source="name" />
  <TextField source="status" />
</ResourceSchema>
```

Use this when a resource should always be scoped — for example, showing only pending tasks:

```tsx
<ResourceSchema name="tasks" defaultFilters={{ status: 'pending' }}>
  {/* fields */}
</ResourceSchema>
```

---

## Field Control Props

Control which fields appear in which views without creating separate custom components.

### `listInclude`, `listExclude`

By default, all fields defined in the schema are included in the List View. Use `listInclude` to specify a subset, or `listExclude` to hide specific fields.

```tsx
<ResourceSchema name="products" listInclude={['id', 'name', 'price']}>
  <TextField source="id" />
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
  <TextField source="description" />
</ResourceSchema>
```

```tsx
<ResourceSchema name="products" listExclude={['description']}>
  <TextField source="id" />
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
  <TextField source="description" />
</ResourceSchema>
```

### `listDisplay`

Fields to display by default in the **List View** table. Users can still toggle other included fields using the table's column preferences.

```tsx
<ResourceSchema name="products" listDisplay={['id', 'name']} listExclude={['description']}>
  <TextField source="id" />
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
  <TextField source="description" />
</ResourceSchema>
```

### `detailInclude`, `detailExclude`

Controls which fields appear in the **Detail View**.

```tsx
<ResourceSchema name="products" detailExclude={['internalNotes']}>
  <TextField source="id" />
  <TextField source="name" />
  <TextField source="internalNotes" />
</ResourceSchema>
```

### `formInclude`, `formExclude`

Controls which fields appear in both **Create** and **Edit Forms** as a shared baseline.

```tsx
<ResourceSchema name="products" formExclude={['id']}>
  <TextField source="id" />
  <TextField source="name" />
  <CurrencyField source="price" currency="USD" />
</ResourceSchema>
```

IDs are a common case: use `<IdField>` (a `<TextField>` with `input={false}`) to display the ID in read views while automatically excluding it from all forms.

```tsx
<ResourceSchema name="products">
  <IdField source="id" />
  <TextField source="name" />
</ResourceSchema>
```

### `editInclude`, `editExclude`, `createInclude`, `createExclude`

For finer-grained control, these view-specific props override `formInclude`/`formExclude` for a single form type.

A common use case is showing a `password` field only on the Create form, and hiding auto-generated fields like `createdAt` only on the Edit form:

```tsx
<ResourceSchema name="users" createInclude={['name', 'email', 'password']} editExclude={['createdAt', 'updatedAt']}>
  <TextField source="name" isRequired />
  <TextField source="email" isRequired />
  <TextField source="password" isRequired />
  <DateField source="createdAt" />
  <DateField source="updatedAt" />
</ResourceSchema>
```

You can also combine `formExclude` (shared baseline) with `createExclude` (additional exclusions for create only):

```tsx
<ResourceSchema name="products" formExclude={['id']} createExclude={['sku']}>
  {/* id hidden in both; sku hidden in create only */}
  <TextField source="id" />
  <TextField source="sku" />
  <TextField source="name" isRequired />
</ResourceSchema>
```

---

## Label Props

Custom titles and descriptions for each view. Each prop accepts a **string**, a **React element**, or (for Edit and Detail) a **function** that receives the current record.

```tsx
<ResourceSchema
  name="products"
  listTitle="Product List"
  createTitle="Create New Product"
  detailTitle="Product: {name}"
  editTitle="Edit Product - {name}"
>
  {/* fields */}
</ResourceSchema>
```

### `listTitle`, `listDescription`

Custom title and description for the **List View**. Accept a string or any React element.

### `createTitle`, `createDescription`

Custom title and description for the **Create Form**. Accept a string or any React element.

### `detailTitle`, `detailDescription`

Custom title and description for the **Detail View**. Accept a string, a React element, or a function `(record) => ReactNode`.

When a string is provided it is treated as an [ICU message](https://unicode-org.github.io/icu/userguide/format_parse/messages/). All record fields are available as named variables:

```tsx
// Simple variable interpolation
<ResourceSchema name="products" detailTitle="Product: {name}" />

// ICU plural rules
<ResourceSchema name="orders" detailTitle="Order #{id} with {count_items, plural, one {# item} other {# items}}" />

// Function form for full control
<ResourceSchema name="products" detailTitle={(record) => record.name} />

// React element
<ResourceSchema name="products" detailTitle={<TextField source="name" />} />
```

:::caution If you plan to translate your app
Prefer the **ICU string form** over a function. Strings like `"Product: {name}"` are picked up by the i18n CLI and can be translated — the `{name}` variable is resolved at runtime after translation. A function like `(record) => record.name` bypasses the translation system entirely and cannot be extracted or localized.
:::

### `editTitle`, `editDescription`

Custom title and description for the **Edit Form**. Accept a string, a React element, or a function `(record) => ReactNode`.

```tsx
// Variable interpolation from the record
<ResourceSchema name="products" editTitle="Edit Product - {name}" />

// Function form for full control
<ResourceSchema name="products" editTitle={(record) => `Edit ${record.name}`} />
```

:::caution If you plan to translate your app
Prefer the **ICU string form** over a function. Strings like `"Edit Product - {name}"` are picked up by the i18n CLI and can be translated — the `{name}` variable is resolved at runtime after translation. A function that constructs the string in JavaScript bypasses the translation system entirely and cannot be extracted or localized.
:::
