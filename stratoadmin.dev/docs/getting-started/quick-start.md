import CodeBlock from '@theme/CodeBlock';
import QuickStartCode from '!!raw-loader!../../../examples/storybook/src/stories/QuickStart.tsx';

# Quick Start

Get a full CRUD interface up and running in minutes. This guide walks you
through setting up a complete admin dashboard for an e-commerce store using
Strato Admin's schema-first architecture. By defining your data schema once, you
can automatically generate list, create, and edit views for your products.

## 1. Create your App

Strato Admin is a React-based framework. You can use it in any React project.

<CodeBlock language="tsx">
  {QuickStartCode}
</CodeBlock>

With this single file, you get a fully functional admin for "products" that can
list, create, and edit records, complete with a professional-looking UI. Notice
we also added a `<ResourceSchema name="categories" />` to satisfy the
`<ReferenceField>`.

## 2. Key Concepts

### `<ResourceSchema>`

The core of the schema-first approach. This component is a powerful wrapper
around React Admin's `<Resource>`. By passing it a `fieldSchema` and an
`inputSchema`, you enable it to automatically render the views for `list`,
`create`, `edit`, and `detail` without you needing to build those components
manually.

### Automatic View Generation

When you provide schemas to `<ResourceSchema>`, it uses its default `list`,
`create`, `edit`, and `detail` components. These default components are schema-aware -
they know how to read the schemas you've provided for the resource and render
the appropriate fields or inputs.

## 3. Next Steps

- Learn more about [`<ResourceSchema>`](../core-concepts/resource-schema.md).
- Explore the [Available Fields](../core-concepts/fields.md) to display your data.
- Learn about [Inputs](../reference/inputs/inputs.md) to build more complex forms.
