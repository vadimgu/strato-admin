# `<RecordMessage>`

Renders a translatable string with all fields of the current record automatically available as ICU variables. Must be used inside a record context (a Detail view, Edit form, or any component wrapped in `RecordContextProvider`).

## Usage

```tsx
import { RecordMessage } from '@strato-admin/admin';

// Interpolate any record field by name
<RecordMessage>{'Product: {name}'}</RecordMessage>

// Multiple fields
<RecordMessage>{'Order #{id} — {status}'}</RecordMessage>

// Explicit stable ID
<RecordMessage id="detail.product.title">{'Product: {name}'}</RecordMessage>

// Disambiguation context
<RecordMessage context="detail">{'Product: {name}'}</RecordMessage>

// Explicit record instead of context
<RecordMessage record={product}>{'Product: {name}'}</RecordMessage>

// Extra variables override record fields of the same name
<RecordMessage vars={{ suffix: '(archived)' }}>{'Product: {name} {suffix}'}</RecordMessage>
```

## Props

| Prop | Type | Description |
| :--- | :--- | :---------- |
| `children` | `string` | **Required.** The ICU template string. All record fields are available as named placeholders. Must be a static string literal for `strato-extract` to detect it. |
| `id` | `string` | Explicit stable message ID. Used directly as the lookup key — bypasses hashing. Takes priority over `context`. Written as `#. id: <id>` in PO files. |
| `context` | `string` | Disambiguation context. Prepended to the message before hashing to produce a unique key. Stored as `msgctxt` in PO files. |
| `comment` | `string` | Translator note written as a `#` comment in the PO file. Ignored at runtime. |
| `record` | `object` | Explicit record to use as ICU variables. When provided, overrides the record from context. |
| `vars` | `Record<string, any>` | Extra ICU variables. Override record fields of the same name. |

See [`<Message>` — How the lookup key is determined](./Message.md#how-the-lookup-key-is-determined) for the full key resolution table — `RecordMessage` follows the same rules.

## How it works

At runtime, `useRecordContext()` returns the current record. All its fields are spread as ICU variables:

```
translate(key, { ...record, ...vars, _: children })
```

Any record field — `id`, `name`, `status`, `createdAt`, etc. — is directly usable as a `{placeholder}` in the message. `vars` overrides record fields of the same name.

If a `record` prop is provided it takes priority over the context record. If neither is present, an empty object is used as fallback; ICU placeholders render as empty strings.

## Extraction

`strato-extract` extracts the children text as the `msgid`. ICU placeholders are preserved so translators can reorder them:

```po
#: src/resources/products.tsx:45
#. id: 10kmuai
msgid "Product: {name}"
msgstr ""
```

A translator can freely adapt the structure for their language:

```po
msgstr "Produit : {name}"
```

## Example

```tsx
import { RecordMessage } from '@strato-admin/admin';

const ProductHeader = () => (
  <h1>
    <RecordMessage>{'Product: {name}'}</RecordMessage>
  </h1>
);
```

When the current record is `{ id: 42, name: 'Laptop' }`, this renders `Product: Laptop` in English and `Produit : Laptop` in French after translation.
