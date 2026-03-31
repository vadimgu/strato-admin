# `<Settings>`

Declares Admin-level defaults for your application. Pass it as the `settings` prop on [`<Admin>`](./Admin.md) to override the framework's built-in defaults for all resources.

```tsx
import { Admin, ResourceSchema, Settings } from '@strato-admin/admin';
import { MyTable } from './MyTable';

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      settings={<Settings listComponent={MyTable} deleteSuccessMessage="Product deleted" />}
    >
      <ResourceSchema name="products">...</ResourceSchema>
    </Admin>
  );
}
```

## Props

| Prop                       | Type                                                    | Default                      | Description                                                                               |
| :------------------------- | :------------------------------------------------------ | :--------------------------- | :---------------------------------------------------------------------------------------- |
| `listComponent`            | `ComponentType`                                         | `<Table>`                    | Default list/table component used for all resources that don't specify their own.         |
| `detailComponent`          | `ComponentType`                                         | `<DetailHub>`                | Default detail component used for all resources that don't specify their own.             |
| `deleteSuccessMessage`     | `string \| ReactNode`                                   | `"Element deleted"`          | Notification shown after a single record is deleted.                                      |
| `bulkDeleteSuccessMessage` | `string \| ReactNode \| ((count: number) => ReactNode)` | `"{count} elements deleted"` | Notification shown after a bulk delete. Pass a function to access the deleted item count. |

---

## `listComponent`

Overrides the default table/list component for every resource in the app. The per-resource `listComponent` prop on [`<ResourceSchema>`](./ResourceSchema.md) takes precedence over this value.

```tsx
import { Cards } from '@strato-admin/admin';

<Admin settings={<Settings listComponent={Cards} />}>...</Admin>;
```

---

## `detailComponent`

Overrides the default detail view component for every resource. Rarely needed — most customization is done per-resource via [`<ResourceSchema>`](./ResourceSchema.md).

---

## `deleteSuccessMessage`

Sets the notification message shown after a single record is deleted via [`<DeleteButton>`](./buttons/DeleteButton.md). Accepts a plain string, a translated string key, or a ReactNode (e.g. a [`<Message>`](./translations/Message.md) component for ICU formatting).

```tsx
// Plain string
<Settings deleteSuccessMessage="Product removed" />;

// ICU via <Message> (extracted and translated automatically)
import { Message } from '@strato-admin/admin';
<Settings deleteSuccessMessage={<Message>Product removed</Message>} />;
```

The full resolution order for the delete success message is:

1. `successMessage` prop on `<DeleteButton>`
2. `deleteSuccessMessage` option on `<ResourceSchema>`
3. `deleteSuccessMessage` on `<Settings>` ← this prop
4. Framework default: `"Element deleted"`

---

## `bulkDeleteSuccessMessage`

Sets the notification message shown after a bulk delete via [`<BulkDeleteButton>`](./buttons/BulkDeleteButton.md). Because the message often includes the number of deleted items, this prop also accepts a **function** that receives the count and returns a ReactNode.

```tsx
// Static string
<Settings bulkDeleteSuccessMessage="Products deleted" />

// Function with count
<Settings
  bulkDeleteSuccessMessage={(count) =>
    count === 1 ? 'One product deleted' : `${count} products deleted`
  }
/>

// ICU plural via <Message>
import { Message } from '@strato-admin/admin';
<Settings
  bulkDeleteSuccessMessage={(count) => (
    <Message vars={{ smart_count: count }}>
      {'{smart_count, plural, =1 {Product deleted} other {# products deleted}}'}
    </Message>
  )}
/>
```

The full resolution order mirrors `deleteSuccessMessage`:

1. `successMessage` prop on `<BulkDeleteButton>`
2. `bulkDeleteSuccessMessage` option on `<ResourceSchema>`
3. `bulkDeleteSuccessMessage` on `<Settings>` ← this prop
4. Framework default: `"{count} elements deleted"`

---

## Reading settings in your own components

Use the [`useSettings`](./hooks/useSettings.md) hook to access the current settings values from any component inside `<Admin>`.

```tsx
import { useSettings } from '@strato-admin/core';

const MyComponent = () => {
  const { listComponent: ListComponent } = useSettings();
  return <ListComponent />;
};
```
