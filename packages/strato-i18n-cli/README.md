# strato-i18n-cli

CLI tools for Strato Admin internationalization.

## Extraction

The `strato-extract` command extracts translatable strings from your source code into translation files (JSON or PO).

```bash
# Basic usage
strato-extract "src/**/*.{ts,tsx}" locales en fr

# Extract to PO files
strato-extract "src/**/*.{ts,tsx}" "locales/*/messages.po"

# Use a custom configuration file
strato-extract --config=my-config.json "src/**/*.{ts,tsx}" "locales/*/messages.po"
```

## Configuration

You can configure the extraction process by creating a `strato-i18n.config.json` file in your project root, or by specifying a path using the `--config` flag.

The configuration allows you to extend the list of components and attributes that the extractor looks for.

### Example `strato-i18n.config.json`

```json
{
  "components": ["MyCustomButton", "SpecialHeader", "Namespace.Component"],
  "translatableProps": ["customLabel", "headerTitle", "tooltip"]
}
```

- **components**: An array of component names (e.g., `Button`, `Table.Col`). The extractor will search for JSX elements matching these names.
- **translatableProps**: An array of prop names (e.g., `label`, `title`). The extractor will extract the string values of these props when found on any of the specified components.

By default, the extractor includes all standard Strato Admin components and common translatable props like `label`, `title`, `placeholder`, etc. Providing a configuration file adds your custom components and props to these defaults.
