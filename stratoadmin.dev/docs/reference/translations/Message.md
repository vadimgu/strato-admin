# `<Message>`

Renders a translatable string inline. The text content is the English source string — it serves as both the translation key and the fallback value when no translation is found.

## Usage

```tsx
import { Message } from '@strato-admin/admin';

// Basic — children is hashed to produce the lookup key
<Message>Product Name</Message>

// Explicit stable ID — used as the key directly, bypasses hashing
<Message id="action.archive">Archive</Message>

// Context — prepended to the message before hashing to disambiguate
<Message context="navigation">Archive</Message>

// Translator note
<Message comment="Shown in the confirmation dialog title">Are you sure?</Message>

// ICU variables via vars prop
<Message vars={{ count: items.length }}>
  {'Found {count, plural, one {# result} other {# results}}'}
</Message>
```

## Props

| Prop | Type | Description |
| :--- | :--- | :---------- |
| `children` | `string` | **Required.** The English source string. Must be a static string literal for `strato-extract` to detect it. |
| `id` | `string` | Explicit stable message ID. Used directly as the lookup key — bypasses hashing. Takes priority over `context`. Written as `#. id: <id>` in PO files. |
| `context` | `string` | Disambiguation context. Prepended to the message before hashing so that `<Message context="x">Save</Message>` resolves to a different entry than `<Message>Save</Message>`. Ignored when `id` is provided. Stored as `msgctxt` in PO files. |
| `comment` | `string` | Translator note written as a `#` comment in the PO file. Visible in tools like Poedit. Ignored at runtime. |
| `vars` | `Record<string, any>` | ICU variables substituted into the message at runtime. |

## How the lookup key is determined

| Props provided | Runtime key | PO representation |
| :------------- | :---------- | :---------------- |
| neither | `hash(children)` | `#. id: <hash>` |
| `context="nav"` | `hash("nav\x04" + children)` | `msgctxt "nav"` + `#. id: <hash>` |
| `id="action.archive"` | `"action.archive"` (literal) | `#. id: action.archive` |

The `#. id:` comment in every PO entry is the authoritative key written into `messages.compiled.json` by `strato-compile`.

### `id` — explicit message ID

Use `id` when you want a stable, human-readable key independent of the English text. Renaming or rewording the English source does not change the key — the translation is preserved automatically.

```tsx
<Message id="action.archive">Archive</Message>
```

PO output:
```po
#: src/components/ArchiveButton.tsx:18
#. id: action.archive
msgid "Archive"
msgstr ""
```

Compiled JSON: `{ "action.archive": "Archiver" }`

At runtime: `translate("action.archive")` → literal lookup → `"Archiver"`.

### `context` — disambiguation by namespace

Use `context` when the same English string has different meanings in different places and needs a separate translation entry. The context is combined with the message before hashing, so the two entries never collide.

```tsx
// verb — "to archive"
<Message context="action">Archive</Message>

// noun — "the archive section"
<Message context="navigation">Archive</Message>
```

PO output — two separate entries with different hashes:
```po
msgctxt "action"
#. id: 1ab2cd3
msgid "Archive"
msgstr ""

msgctxt "navigation"
#. id: 4ef5gh6
msgid "Archive"
msgstr ""
```

## Extraction

`strato-extract` detects `<Message>` and emits a PO entry for each static children string. Dynamic expressions are not extracted.

With `comment`:
```po
#  Shown in the confirmation dialog title
#: src/components/ConfirmDialog.tsx:4
#. id: 3xp2ab1
msgid "Are you sure?"
msgstr ""
```

## ICU variables

Pass a `vars` object to provide values for ICU placeholders:

```tsx
<Message vars={{ count: cart.items.length }}>
  {'Your cart has {count, plural, =0 {no items} one {# item} other {# items}}'}
</Message>
```

:::tip Escaping braces in JSX
To write an ICU string with curly braces as a JSX child, wrap it in a JSX expression container: `{'string with {variable}'}`. Otherwise JSX treats `{variable}` as JavaScript.
:::
