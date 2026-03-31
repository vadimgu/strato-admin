---
sidebar_position: 8
title: 'Auth Providers'
---

# Auth Providers

An **auth provider** is an adapter between Strato Admin and your authentication system. It handles login, logout, session checking, token refresh, user identity, and permissions.

Auth providers are optional. If you omit the `authProvider` prop on `<Admin>`, the app is publicly accessible with no login page.

Strato Admin uses the same `AuthProvider` interface as [React-Admin](https://marmelab.com/react-admin/AuthProviderList.html), so any React-Admin auth provider is compatible.

## Passing an Auth Provider

```tsx
import { Admin, ResourceSchema } from '@strato-admin/admin';
import { myAuthProvider } from './myAuthProvider';
import { myDataProvider } from './myDataProvider';

const App = () => (
  <Admin authProvider={myAuthProvider} dataProvider={myDataProvider}>
    <ResourceSchema name="products" />
  </Admin>
);
```

Once an auth provider is set, Strato Admin will:

- Redirect unauthenticated users to `/login`
- Call `checkAuth` on every route change
- Call `checkError` whenever the data provider returns an error
- Display the user's name and avatar in the app bar (via `getIdentity`)

## The AuthProvider Interface

```ts
const authProvider = {
  login:          (params)  => Promise<void | { redirectTo? }>,
  logout:         (params)  => Promise<void | string>,
  checkAuth:      (params)  => Promise<void>,
  checkError:     (error)   => Promise<void>,
  getIdentity?:   ()        => Promise<UserIdentity>,
  getPermissions?:(params)  => Promise<any>,
};
```

The four required methods are `login`, `logout`, `checkAuth`, and `checkError`. `getIdentity` and `getPermissions` are optional but commonly used.

### `login`

Called when the user submits the login form. Receives the form values (by default `{ username, password }`). Should store credentials (e.g. a token in `localStorage`) on success, or throw/reject on failure.

```ts
login: async ({ username, password }) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const { token } = await response.json();
  localStorage.setItem('token', token);
},
```

Optionally return `{ redirectTo: '/dashboard' }` to override where the user lands after login.

### `logout`

Called when the user clicks the logout button, or when `checkError` or `checkAuth` reject. Should clear any stored credentials.

```ts
logout: () => {
  localStorage.removeItem('token');
  return Promise.resolve();
},
```

Return a string (a path) to redirect to a custom page after logout, or `false` to stay on the current page.

### `checkAuth`

Called on every route navigation. Resolve to allow access; reject to redirect to the login page.

```ts
checkAuth: () => {
  return localStorage.getItem('token')
    ? Promise.resolve()
    : Promise.reject();
},
```

### `checkError`

Called whenever the data provider throws an error. Use this to handle `401 Unauthorized` and `403 Forbidden` responses — for example, to force a logout or trigger a token refresh.

Resolve to let the user stay logged in; reject to force logout.

```ts
checkError: ({ status }) => {
  if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    return Promise.reject();
  }
  return Promise.resolve();
},
```

### `getIdentity` (optional)

Called to display the user's name and avatar in the top navigation bar. Return a `UserIdentity` object:

```ts
interface UserIdentity {
  id: string | number;
  fullName?: string;
  avatar?: string; // URL to a profile image
  [key: string]: any; // any extra fields you need
}
```

```ts
getIdentity: async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await response.json();
  return {
    id:       user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    avatar:   user.avatarUrl,
  };
},
```

### `getPermissions` (optional)

Called before rendering protected views. Returns whatever your app treats as "permissions" — a role string, an array of strings, or a structured object. The shape is up to you.

```ts
getPermissions: () => {
  const role = localStorage.getItem('role');
  return Promise.resolve(role ?? 'guest');
},
```

## Writing a Custom Auth Provider

Here is a complete example for a JWT-based backend:

```ts
import { AuthProvider } from '@strato-admin/admin';

const TOKEN_KEY = 'auth_token';

export const myAuthProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Login failed');
    }

    const { token } = await response.json();
    localStorage.setItem(TOKEN_KEY, token);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },

  checkAuth: () => (localStorage.getItem(TOKEN_KEY) ? Promise.resolve() : Promise.reject()),

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { id, name, avatar } = await response.json();
    return { id, fullName: name, avatar };
  },

  getPermissions: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { role } = await response.json();
    return role;
  },
};
```

## Adding Auth Headers to Requests

Your auth provider stores credentials; your data provider needs to send them. Pass the token in your data provider's HTTP client:

```ts
import { fetchUtils, DataProvider } from '@strato-admin/admin';

const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, { ...options, headers });
};

export const myDataProvider: DataProvider = {
  getList: async (resource, params) => {
    // httpClient automatically attaches the Authorization header
    const { json } = await httpClient(`/api/${resource}`);
    return { data: json.items, total: json.total };
  },
  // ...
};
```

## Token Refresh

For automatic token refresh on 401 responses, use `addRefreshAuthToAuthProvider` and `addRefreshAuthToDataProvider`:

```ts
import { addRefreshAuthToAuthProvider, addRefreshAuthToDataProvider } from '@strato-admin/admin';

const refreshAuth = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) throw new Error('Session expired');
  const { token } = await response.json();
  localStorage.setItem('auth_token', token);
};

export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, refreshAuth);

export const dataProvider = addRefreshAuthToDataProvider(myDataProvider, refreshAuth);
```

When a request fails with a 401, the framework calls `refreshAuth`, then retries the original request automatically.

## Using Permissions

Read the current user's permissions anywhere in your app with `usePermissions`:

```tsx
import { usePermissions } from '@strato-admin/admin';

const MyComponent = () => {
  const { permissions } = usePermissions();

  if (permissions !== 'admin') {
    return <p>Access denied.</p>;
  }

  return <AdminOnlyPanel />;
};
```

## Using the Current User Identity

Read the current user anywhere with `useGetIdentity`:

```tsx
import { useGetIdentity } from '@strato-admin/admin';

const WelcomeBanner = () => {
  const { identity } = useGetIdentity();
  return <p>Welcome, {identity?.fullName}!</p>;
};
```
