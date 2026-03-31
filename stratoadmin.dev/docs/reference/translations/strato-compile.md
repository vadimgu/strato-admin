# `strato-compile`

CLI tool that converts `.po` or `.json` translation files produced by [`strato-extract`](./strato-extract.md) into compact `hash → translation` JSON bundles ready for the browser.

## Synopsis

```bash
strato-compile [options] <pattern>
```

## Arguments

| Argument  | Description                                                                                                                                                                                                   |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pattern` | Glob or directory path matching the translation files to compile. **Default:** `locales` (all `.po` and `.json` files in that directory). Files already ending in `.compiled.json` are automatically skipped. |

## Options

| Option              | Short | Description                                                                                                                                  |
| :------------------ | :---- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `--out-file <path>` | `-o`  | Write the compiled output to a specific file instead of deriving the name from the input. Only valid when the pattern matches a single file. |

## Examples

```bash
# Compile all .po files under locales/ (outputs locales/*/messages.compiled.json)
strato-compile "locales/*/messages.po"

# Compile a single file
strato-compile locales/fr/messages.po

# Compile to a specific output path
strato-compile locales/fr/messages.po --out-file public/fr.json
```

## Input formats

### PO files

Each entry's hash is resolved from (in priority order):

1. The `msgctxt` field (explicit stable key from `translate('key', { _: 'Default' })`)
2. The `#. id:` extracted comment (the stable hash written by `strato-extract`)
3. The raw `msgid` (legacy fallback)

If `msgstr` is empty, the `msgid` is used as the fallback translation (English passthrough).

### JSON files

The JSON format produced by `strato-extract`:

```json
{
  "1kdfstp": {
    "defaultMessage": "Products",
    "translation": "Produits"
  }
}
```

If `translation` is empty or missing, `defaultMessage` is used as the fallback.

## Output format

Each input file is compiled to a `<name>.compiled.json` file next to it (or the path specified by `--out-file`). The output is a flat `hash → string` object:

```json
{
  "10kmuai": "Modifier le produit - {name}",
  "1kdfstp": "Produits",
  "1pdyg96": "Prix"
}
```

Keys are sorted alphabetically. Only entries with a non-empty translation (or a defaultMessage fallback) are included. The values are normalized — leading/trailing whitespace and consecutive whitespace sequences are collapsed to a single space before writing.

## Recommended `package.json` scripts

```json
{
  "scripts": {
    "i18n:extract": "strato-extract --format=po \"src/**/*.{ts,tsx}\" \"locales/*/messages.po\"",
    "i18n:compile": "strato-compile \"locales/*/messages.po\""
  }
}
```

Run `i18n:extract` after adding or renaming labels, then send the updated `.po` files to translators. Run `i18n:compile` after receiving translations back to generate the bundles loaded by `icuI18nProvider`.
