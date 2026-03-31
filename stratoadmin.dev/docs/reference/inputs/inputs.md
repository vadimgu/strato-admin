---
sidebar_position: 1
title: 'Inputs'
---

# Inputs

Input components are used in forms to allow users to create and edit data. They are designed to work seamlessly with React Admin's form state management.

All input components automatically:

- Synchronize their value with the form state using the `source` prop.
- Display a label based on the `source` prop (if not provided).
- Display validation errors.
- Support common Cloudscape props like `description`, `constraintText`, and `info`.

## Common Props

All input components wrap a Cloudscape `FormField` and support these common props:

### `source`

The field name in the record. This is used to bind the input to the form state.

### `label`

The label for the input. If not provided, it's automatically generated from the `source` prop and translated. Set to `false` to hide the label.

### `description`

Secondary text to display below the label.

### `constraintText`

Additional information about the expected format of the input.

### `info`

A link to additional information, typically an `<a>` or `Cloudscape Link`.

### `validate`

A validation function or an array of validation functions. See [Validation](./validation.md) for the full list of built-in validators and how to write custom ones.

## Custom Inputs

If you need to build a custom input component, you can use the [`<FormField>`](./FormField.md) component to wrap your custom UI. It handles the label, description, and error display for you.

## Available Inputs

- [`<TextInput>`](./TextInput.md): Single-line text input.
- [`<TextAreaInput>`](./TextAreaInput.md): Multi-line text input.
- [`<NumberInput>`](./NumberInput.md): Numeric input.
- [`<SliderInput>`](./SliderInput.md): Slider range selection.
- [`<SelectInput>`](./SelectInput.md): Dropdown selection.
- [`<AutocompleteInput>`](./AutocompleteInput.md): Autocomplete text input.
- [`<ReferenceInput>`](./ReferenceInput.md): For selecting related records.
- [`<BooleanInput>`](./BooleanInput.md): Toggle switch for boolean values.
- [`<ArrayInput>`](./ArrayInput.md): For managing arrays of structured items.
- [`<AttributeEditor>`](./AttributeEditor.md): For managing arrays of complex objects.
- [`<FormField>`](./FormField.md): Wrapper for custom input components.
