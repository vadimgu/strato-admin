# strato-admin

WORK IN PROGRESS

A frontend Framework for building admin interfaces, built on top of React-Admin with Cloudscape Design System. It provides a set of reusable components and tools to help developers create efficient and user-friendly admin interfaces.

High speed development without compromising on versatility.

## Features

- Backend agnostic: Using React-Admin data providers, you can connect to any backend API.
- Great development experience: Declarative API.

## Installation

```bash
npm install strato-admin
# or
pnpm install strato-admin
```

## Documentation

...


## At a Glance

```tsx
export const UsersList = () => (
    <List resource="users">
      <Table>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="email" />
      </Table>
    </List>
);
```

## Does It Work With My Backend

Yes! Strato Admin is built on top of React-Admin, which uses data providers to connect to any backend API. You can use existing data providers or create your own to connect to your backend.

## Flexibility

You can use Cloudscape Design System components directly with "headless"
components provided by Strato Admin. This allows you to create custom interfaces
while still benefiting from the design system's consistency and accessibility.

## Examples

... (coming soon)


