# Strato Admin

Strato Admin is a React-based framework for building administrative interfaces.
It integrates [React-Admin](https://marmelab.com/react-admin/) core logic with
the [AWS Cloudscape Design System](https://cloudscape.design/) to provide a set
of components optimized for data-dense, accessible, and consistent back-office
applications.

<p align="center">
  <img src="stratoadmin.dev/images/quickstart_products_list.png" width="600" alt="Strato Admin Products List" />
</p>

## Overview

Enterprise admin tools often face a trade-off: either use a fast-to-develop CRUD
framework that can feel too generic forusers, or build a custom UI from scratch
at a much higher development and maintenance cost.

Strato Admin provides a schema-first workflow that generates standardized views
out-of-the-box, while retaining the flexibility to drop down to view-based
approaches or headless hooks for more complex, custom requirements.

## Installation

The easiest way to start a new project is using our scaffolding tool:

```bash
pnpm create @strato-admin
```

This will create a new project pre-configured with Vite, React 19, and the Cloudscape Design System.

Alternatively, you can add it to an existing project:

```bash
pnpm add @strato-admin/admin
```

## Quick Start

```tsx
import React from 'react';
import { Admin, ResourceSchema, TextField, CurrencyField, ReferenceField, IdField } from '@strato-admin/admin';
import { dataProvider } from '@strato-admin/faker-ecommerce';

export const QuickStartApp = () => (
  <Admin dataProvider={dataProvider} title="Strato Admin Quickstart">
    <ResourceSchema name="products">
      <IdField source="id" />
      <TextField source="name" isRequired link="show" />
      <CurrencyField source="price" currency="EUR" />
      <ReferenceField source="category_id" reference="categories" />
    </ResourceSchema>

    <ResourceSchema name="categories">
      <IdField source="id" />
      <TextField source="name" link="show" isRequired />
    </ResourceSchema>
  </Admin>
);
```

| List Page                                                                                         | Details Page                                                                                     |
| :------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------- |
| <img src="stratoadmin.dev/images/quickstart_products_list.png" width="600" alt="List Page" />     | <img src="stratoadmin.dev/images/quickstart_products_show.png" width="600" alt="Details Page" /> |
| Create Page                                                                                       | Edit Page                                                                                        |
| <img src="stratoadmin.dev/images/quickstart_products_create.png" width="600" alt="Create Page" /> | <img src="stratoadmin.dev/images/quickstart_products_edit.png" width="600" alt="Edit Page" />    |

### Schema-Driven UI Generation

The framework allows you to define a central data model (schema) for your resources. Standard List, Create, Edit, and Show views are automatically generated from this schema, ensuring consistency across the application and reducing the manual implementation of repetitive UI patterns.

### Built on Cloudscape Design System

Unlike general-purpose UI libraries, Cloudscape is specifically designed for complex, technical applications. By using Cloudscape, Strato Admin inherits:

- **Built-in Accessibility**: All components are designed for high accessibility standards.
- **Data-Dense Layouts**: UI patterns optimized for information density and technical workflows.
- **Advanced Data Tables**: Support for multi-field filtering, column reordering, and user preferences out of the box.

### React-Admin Core Integration

Strato Admin currently integrates a **vendored** version of React-Admin core (`@strato-admin/ra-core`). This approach involves maintaining the dependency's source code directly within the monorepo, which provides several technical advantages:

- **Custom Patching**: Direct access to the core logic allows for immediate bug fixes and the application of patches specific to the framework's requirements.
- **Deep Integration**: It enables tighter coupling between React-Admin's state management and the Cloudscape Design System's complex UI patterns.
- **Dependency Stability**: The framework is insulated from upstream breaking changes, ensuring a predictable development and release cycle.

See [Note on Vendoring](#note-on-vendoring) for more details on this architectural choice.

## Key Features

### Implementation Patterns

- **Schema-First**: Define data models once to automatically render standardized views.
- **Declarative View Composition**: Explicitly define views using Cloudscape-themed components for more granular control.
- **Headless Hooks**: Low-level hooks for building custom interfaces while leveraging the framework's state and data logic.

### Technical Foundation

- **Backend Agnostic**: Compatible with any backend via React-Admin data providers (REST, GraphQL, etc.).
- **Internationalization (i18n)**: Uses ICU MessageFormat for robust translation support, including pluralization and conditional selection (select).

## Monorepo Structure

- **`@strato-admin/admin`**: Main package aggregating core logic and UI components.
- **`@strato-admin/cloudscape`**: Implementation of React-Admin components using AWS Cloudscape.
- **`@strato-admin/core`**: Framework-agnostic logic, schema definitions, and headless hooks.
- **`@strato-admin/ra-core`**: A vendored fork of React-Admin core, enabling direct modifications and tighter framework integration.
- **`@strato-admin/i18n`**: ICU MessageFormat-based i18n provider.
- **`@strato-admin/i18n-cli`**: CLI tool for translation extraction and compilation.

## Development

### Documentation

The documentation is built with Docusaurus:

```bash
pnpm run docs:dev
```

### Storybook

UI components are developed and documented in isolation using Storybook:

```bash
pnpm run storybook
```

### Testing

To update documentation screenshots using Playwright:

```bash
cd packages/@strato-admin/cloudscape && npx playwright test e2e/screenshots.spec.ts
```

## Architectural Approaches

Strato Admin supports three primary development styles depending on the required level of control:

1.  **Schema-First**: High-level resource definitions for rapid prototyping and standardized CRUD.
2.  **Themed Components**: Explicit view definitions using declarative components.
3.  **Headless Integration**: Direct use of framework hooks with custom UI components.

See the [Architectural documentation](docs/docs/architecture.md) for more details.

## Note on Vendoring

Vendoring is an interim architectural choice and not a core requirement of the project. The primary downside is the increased maintenance overhead and the risk of drifting from upstream React-Admin improvements. This decision is not final; as the integration points between React-Admin and Cloudscape stabilize, the project may transition back to using upstream packages to reduce long-term maintenance debt.
