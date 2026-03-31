# `strato-extract`

CLI tool that scans your TypeScript/TSX source files, finds translatable strings on Strato components, and writes them to `.po` or `.json` translation files. New strings are appended; existing translations are preserved.

## Synopsis

```bash
strato-extract [options] <src-pattern> [<output-glob> | <locale-dir> [locale...]]
```

## Arguments

| Argument      | Description                                                                                                                                              |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src-pattern` | Glob matching source files to scan. **Default:** `src/**/*.{ts,tsx}`                                                                                     |
| `output-glob` | A glob containing `*` — matched files are used as output targets. The locale is inferred from the directory name (e.g. `locales/fr/messages.po` → `fr`). |
| `locale-dir`  | Directory to write locale files into. Pass one or more locale codes as additional args.                                                                  |
| `locale...`   | Locale codes to generate when using the `locale-dir` form. **Default:** `en`                                                                             |

## Options

| Option              | Short | Description                                                                                              |
| :------------------ | :---- | :------------------------------------------------------------------------------------------------------- |
| `--format <fmt>`    | `-f`  | Output format: `po` or `json`. Inferred from the file extension when not specified.                      |
| `--config <path>`   |       | Path to a custom `strato-i18n.config.json`. Defaults to `./strato-i18n.config.json`.                     |
| `--out-file <path>` | `-o`  | Write all extracted messages to a single file. When used, only the first matched output file is written. |
| `--locale <code>`   | `-l`  | Locale code to use when `--out-file` is set.                                                             |
| `--ignore <glob>`   | `-i`  | Exclude files matching this glob. May be repeated.                                                       |

## Examples

```bash
# Scan src/, write to locales/en/messages.po and locales/fr/messages.po
strato-extract --format=po "src/**/*.{ts,tsx}" "locales/*/messages.po"

# Scan src/, write JSON files for en and fr
strato-extract "src/**/*.{ts,tsx}" locales en fr

# Ignore generated files
strato-extract --format=po --ignore="src/**/*.generated.tsx" \
  "src/**/*.{ts,tsx}" "locales/*/messages.po"
```

## Output format

### PO (recommended)

Each extracted string becomes a PO entry. The stable hash ID is stored in the `#. id:` comment; source file locations are stored in `#:` reference comments.

```po
#: src/resources/products.tsx:29
#. id: 1kdfstp
msgid "Products"
msgstr ""

#: src/resources/products.tsx:32
#. id: 10kmuai
msgid "Edit Product - {name}"
msgstr ""
```

Translators fill in `msgstr`. The hash in `#. id:` must not be changed — it is the stable key used by the runtime.

:::caution Not classical Gettext
The message format inside `msgid`/`msgstr` is **ICU**, not Gettext. Pluralization is written as a single ICU string (e.g. `{count, plural, one {# item} other {# items}}`), not using Gettext's `msgid_plural` / `msgstr[n]` fields. Standard tools like Poedit can open these files but their plural helpers will not apply.
:::

### JSON

```json
{
  "1kdfstp": {
    "defaultMessage": "Products",
    "translation": "",
    "locations": ["src/resources/products.tsx:29"]
  }
}
```

## `<Message>` and `<RecordMessage>`

These components are handled differently from other Strato components: the extractor reads their **JSX children** as the translatable string rather than a prop value.

Each supports three special props that control how the PO entry is generated:

| Prop               | PO effect                                         | Runtime key               |
| :----------------- | :------------------------------------------------ | :------------------------ |
| _(none)_           | `#. id: <hash(message)>`                          | `hash(message)`           |
| `id="action.save"` | `#. id: action.save`                              | `"action.save"` (literal) |
| `context="nav"`    | `msgctxt "nav"` + `#. id: <hash(nav\x04message)>` | `hash("nav\x04message")`  |

`id` takes priority over `context` when both are provided.

**`comment` prop** is written as a `#` translator note in the PO file:

```tsx
<Message comment="Verb, not noun">Archive</Message>
```

```po
#  Verb, not noun
#: src/components/Button.tsx:12
#. id: 1kdfstp
msgid "Archive"
msgstr ""
```

:::note Static children only
Only **string literal** children are extracted — plain text or a `{'string'}` JSX expression. Dynamic values, variables, and template literals with embedded expressions are not extracted.
:::

## Default components

The extractor recognizes translatable props on these built-in Strato components:

`ArrayField`, `AttributeEditor`, `AutocompleteInput`, `BooleanField`, `BulkDeleteButton`, `Button`, `Create`, `CreateButton`, `DateField`, `Edit`, `EditButton`, `FormField`, `List`, `NumberField`, `NumberInput`, `ReferenceField`, `ReferenceInput`, `ReferenceManyField`, `Resource`, `ResourceSchema`, `SaveButton`, `SelectInput`, `StatusIndicatorField.Label`, `Table`, `Table.Col`, `TextAreaInput`, `TextField`, `TextInput`

## Default translatable props

| Category     | Props                                                                                         |
| :----------- | :-------------------------------------------------------------------------------------------- |
| Labels       | `label`, `listLabel`, `createLabel`, `editLabel`, `detailLabel`                               |
| Titles       | `title`, `listTitle`, `createTitle`, `editTitle`, `detailTitle`                               |
| Descriptions | `description`, `listDescription`, `createDescription`, `editDescription`, `detailDescription` |
| Form         | `placeholder`, `emptyText`, `helperText`, `constraintText`, `saveButtonLabel`                 |
| Feedback     | `successMessage`, `errorMessage`                                                              |

## Configuration file

Create `strato-i18n.config.json` in your project root to extend the defaults with your own components and props. The built-in lists are merged with your additions — you do not need to repeat them.

```json
{
  "components": ["MyCustomButton", "HeroSection"],
  "translatableProps": ["ctaText", "subheading"]
}
```

Pass a custom path with `--config` if the file is not at the project root.

## `translate()` calls

In addition to JSX props, `strato-extract` also extracts calls to `translate()` and `translateLabel()`. This lets you translate strings that appear outside JSX:

```ts
// Extracted as a translatable string
const label = translate('Status');

// Extracted with an explicit stable key instead of a hash
const label = translate('my.explicit.key', { _: 'Status' });
```

When the second argument is `{ _: "Default Text" }`, `"Default Text"` becomes the `msgid` and the first argument (`"my.explicit.key"`) becomes the context (`msgctxt`), creating a stable key that won't change even if the default text is reworded.
