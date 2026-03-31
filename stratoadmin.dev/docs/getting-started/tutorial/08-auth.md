# Authentication & Role-Based Access

Right now, StratoShop is wide open — anyone can access it. In this chapter, we will add an **Auth Provider** to require login and then use permissions to restrict what different users can do.

## The Auth Provider

An Auth Provider is a plain object that implements the authentication contract between your app and your backend. Pass it to `<Admin>` via the `authProvider` prop.

Here is a minimal implementation for a token-based API. Create `src/authProvider.ts`:

```ts title="src/authProvider.ts"
import type { AuthProvider } from '@strato-admin/admin';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { token, role } = await response.json();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_role', role);
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  },

  checkAuth: async () => {
    if (!localStorage.getItem('auth_token')) {
      throw new Error('Not authenticated');
    }
  },

  checkError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth_token');
      throw error;
    }
  },

  getPermissions: async () => {
    return localStorage.getItem('auth_role') ?? 'viewer';
  },
};
```

Wire it into your app:

```tsx title="src/App.tsx"
import { authProvider } from './authProvider';

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {/* ... */}
  </Admin>
);
```

With this in place, unauthenticated users are automatically redirected to a login page. Strato Admin provides a default login form — you don't need to build one.

## How Authentication Works

When `authProvider` is present, Strato Admin calls `checkAuth` before rendering any protected page. If it throws, the user is sent to `/login`. After a successful `login` call, they are redirected back to the page they tried to access.

The `checkError` method is called whenever a data provider request fails. If you throw from it (for 401/403 responses), the user is logged out automatically.

## Role-Based Access Control

The `getPermissions` method returns whatever your backend uses to represent a user's role — a string, an array, or an object. You can then use this in your resource definitions to conditionally disable destructive actions.

### Hiding the Delete Button

Use the `delete` prop on `<ResourceSchema>` to disable delete access. For dynamic control based on the logged-in user's role, read permissions using the `usePermissions` hook in a wrapper component:

```tsx title="src/resources/products.tsx"
import { usePermissions, ResourceSchema, TextField, NumberField } from '@strato-admin/admin';

export const ProductResource = () => {
  const { permissions } = usePermissions();
  const canDelete = permissions === 'admin';

  return (
    <ResourceSchema name="products" delete={canDelete} listInclude={['name', 'price', 'category_id', 'status']}>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="status" />
    </ResourceSchema>
  );
};
```

Update `App.tsx` to render it as a component rather than a static JSX element:

```tsx title="src/App.tsx"
const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <ProductResource />
    {/* other resources */}
  </Admin>
);
```

> **Note:** Setting `delete={false}` hides the delete button and disables the bulk delete action in the UI. It does **not** prevent direct API calls — always enforce permissions on the server as well.

## Quick Start: Mock Auth Provider

For development or demos, you can use a simple mock that accepts any credentials:

```ts title="src/authProvider.ts"
export const authProvider: AuthProvider = {
  login: async ({ username }) => {
    localStorage.setItem('auth_role', username === 'admin' ? 'admin' : 'editor');
  },
  logout: async () => localStorage.clear(),
  checkAuth: async () => {
    if (!localStorage.getItem('auth_role')) throw new Error();
  },
  checkError: async (error) => {
    if (error.status === 401) throw error;
  },
  getPermissions: async () => localStorage.getItem('auth_role') ?? 'viewer',
};
```

Log in with username `admin` to get the `admin` role, or any other username for the `editor` role.

## Summary

In this chapter, we've learned how to:

- Implement an `AuthProvider` to add login/logout to the dashboard.
- Use `checkAuth` and `checkError` to protect routes and handle expired sessions.
- Use `getPermissions` and `usePermissions` to apply role-based access control.

## Next Steps

In the next chapter, we will build a **custom dashboard** using Strato's headless hooks and Cloudscape chart components.
