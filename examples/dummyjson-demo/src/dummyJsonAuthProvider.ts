import { AuthProvider, UserIdentity } from 'strato-admin';

const API_URL = 'https://dummyjson.com';
const AUTH_TOKEN_KEY = 'dummyjson_access_token';
const REFRESH_TOKEN_KEY = 'dummyjson_refresh_token';
const USER_KEY = 'dummyjson_user';

interface LoginParams {
  username: string;
  password: string;
}

interface DummyJsonUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

interface DummyJsonAuthResponse extends DummyJsonUser {}

/**
 * React-Admin Auth Provider for DummyJSON.com
 *
 * DummyJSON Auth endpoints:
 * - POST /auth/login - authenticate with username/password
 * - GET /auth/me - get current user (requires Bearer token)
 * - POST /auth/refresh - refresh access token
 *
 * Test credentials (from dummyjson.com/users):
 * - username: "emilys", password: "emilyspass"
 * - username: "michaelw", password: "michaelwpass"
 */
export const dummyJsonAuthProvider: AuthProvider = {
  /**
   * Authenticate user with username/password
   * Called when the user submits the login form
   */
  login: async ({ username, password }: LoginParams) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid credentials');
    }

    const user: DummyJsonAuthResponse = await response.json();

    // Store tokens and user info
    localStorage.setItem(AUTH_TOKEN_KEY, user.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return Promise.resolve();
  },

  /**
   * Log out the user
   * Called when the user clicks the logout button
   */
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return Promise.resolve();
  },

  /**
   * Check if the user is authenticated
   * Called on every route navigation
   */
  checkAuth: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? Promise.resolve() : Promise.reject();
  },

  /**
   * Handle authentication errors from the API
   * Called when the dataProvider returns an error
   */
  checkError: async (error: { status?: number; message?: string }) => {
    const status = error.status;

    if (status === 401) {
      // Try to refresh the token
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (refreshToken) {
        try {
          const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken,
              expiresInMins: 60,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            // Retry is handled by the caller
            return Promise.resolve();
          }
        } catch {
          // Refresh failed, force logout
        }
      }

      // Clear auth and reject
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return Promise.reject();
    }

    if (status === 403) {
      // Forbidden - user doesn't have permission
      return Promise.reject({ message: 'Forbidden' });
    }

    // Other errors don't require authentication check
    return Promise.resolve();
  },

  /**
   * Get the current user identity
   * Used to display user info in the app bar
   */
  getIdentity: async (): Promise<UserIdentity> => {
    const userStr = localStorage.getItem(USER_KEY);

    if (userStr) {
      const user = JSON.parse(userStr) as DummyJsonUser;
      return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        avatar: user.image,
      };
    }

    // Fetch from API if not in localStorage
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user: DummyJsonUser = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.image,
    };
  },

  /**
   * Get user permissions
   * DummyJSON doesn't have a permissions system, so we return a default role
   * You could extend this based on user properties
   */
  getPermissions: () => {
    const userStr = localStorage.getItem(USER_KEY);

    if (userStr) {
      const user = JSON.parse(userStr) as DummyJsonUser;
      // Example: derive permissions from user data
      // DummyJSON users have a company.title field you could use
      return Promise.resolve({ role: 'user', userId: user.id });
    }

    return Promise.resolve({ role: 'guest' });
  },
};

/**
 * Helper to get the current access token
 * Use this in your data provider to add auth headers
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Helper to check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

export default dummyJsonAuthProvider;
