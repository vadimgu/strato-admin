# strato-admin

WORK IN PROGRESS

A frontend framework for building admin interfaces, built on top of React-Admin and the Cloudscape Design System. It provides a set of reusable components and tools to help developers create efficient and user-friendly admin interfaces.

High-speed development without compromising on versatility.

## Features

### ⚡ Development Velocity
- **Schema-First Architecture**: Define your data model once and let components automatically render the UI for maximum speed.
- **Declarative View-Based UI**: Standard React-Admin style components for granular control.
- **Backend Agnostic**: Connect to any backend using the extensive ecosystem of React-Admin data providers.

### 🏗️ Enterprise-Grade Quality
- **Accessible by Default**: Built with AWS Cloudscape components, meeting WCAG standards out of the box.
- **Robust Internationalization**: Built-in ICU message support for a global audience.
- **Type-Safe Foundation**: First-class TypeScript support for a predictable developer experience.

### 🧩 Architectural Versatility
- **Headless Integration Hooks**: First-class "headless" hooks for building entirely custom interfaces.
- **Themed Logic**: Preserves battle-tested state management while delivering a modern Cloudscape UI.

## Installation

```bash
npm install strato-admin
# or
pnpm install strato-admin
```

## Quick Start

```tsx
import { Admin, Resource, List, Table, TextField } from 'strato-admin';
import { jsonServerDataProvider } from 'ra-data-json-server';

const dataProvider = jsonServerDataProvider('https://jsonplaceholder.typicode.com');

const UsersList = () => (
  <List>
    <Table title="Users" filtering preferences>
      <Table.Column source="id" label="ID" link="show" />
      <Table.Column source="name" label="Name" sortable />
      <Table.Column source="email" label="Email" />
      <Table.Column source="website" label="Website" />
    </Table>
  </List>
);

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={UsersList} />
  </Admin>
);
```

## Documentation

The documentation is built with Docusaurus. To start it locally:

```bash
pnpm run docs:dev
```

## UI Components Library (Storybook)

We use Storybook to develop and showcase our UI components in isolation.

```bash
pnpm run storybook
```

To update the static screenshots used in the documentation:

```bash
cd packages/strato-cloudscape && npx playwright test e2e/screenshots.spec.ts
```

## Architectural Approaches

Strato Admin supports three primary development styles:

1.  **Schema-First**: Define a central data model and let components automatically render the UI. Best for maximum speed.
2.  **View-Based (React-Admin style)**: Explicitly define views using declarative themed components. Best for standard CRUD with granular control.
3.  **Headless Integration**: Use low-level hooks like `useCollection` with raw Cloudscape components. Best for highly custom layouts.

See the [Architectural Approaches documentation](https://github.com/vlad-strato/strato-admin/blob/main/docs/docs/architecture.md) for more details.

## Examples

Check out the [demo example](./examples/demo) for a more comprehensive showcase of features including:

- Complex data types (Dates, Booleans, Numbers)
- Reference fields and relationships
- Detail views (Show)
- Selection and bulk actions
- Column reordering and visibility preferences
