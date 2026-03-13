# strato-admin

WORK IN PROGRESS

A frontend framework for building admin interfaces, built on top of React-Admin and the Cloudscape Design System. It provides a set of reusable components and tools to help developers create efficient and user-friendly admin interfaces.

High-speed development without compromising on versatility.

## Features

- **Backend Agnostic**: Connect to any backend using React-Admin data providers.
- **Great Developer Experience**: Declarative, type-safe API.
- **Modern UI**: Built with AWS's Cloudscape Design System for accessibility and consistency.
- **I18n Built-in**: Robust internationalization support.

## Installation

```bash
npm install strato-admin
# or
pnpm install strato-admin
```

## Quick Start

```tsx
import { Admin, Resource, List, DataTable, TextField } from 'strato-admin';
import { jsonServerDataProvider } from 'ra-data-json-server';

const dataProvider = jsonServerDataProvider('https://jsonplaceholder.typicode.com');

const UsersList = () => (
  <List>
    <DataTable header="Users" filtering preferences>
      <DataTable.Col source="id" label="ID" link="show" />
      <DataTable.Col source="name" label="Name" sortable />
      <DataTable.Col source="email" label="Email" />
      <DataTable.Col source="website" label="Website" />
    </DataTable>
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

## Flexibility

You can use Cloudscape Design System components directly with "headless" components provided by Strato Admin. This allows you to create custom interfaces while still benefiting from the design system's consistency and accessibility.

## Examples

Check out the [demo example](./examples/demo) for a more comprehensive showcase of features including:
- Complex data types (Dates, Booleans, Numbers)
- Reference fields and relationships
- Detail views (Show)
- Selection and bulk actions
- Column reordering and visibility preferences
