import { DataProvider, fetchUtils } from 'strato-admin';

const API_URL = 'https://dummyjson.com';

/**
 * React-Admin Data Provider for DummyJSON.com
 *
 * Handles the mapping between React-Admin's expected API format and
 * DummyJSON's actual response structure.
 *
 * DummyJSON specifics:
 * - Pagination: ?limit=X&skip=Y (not _start/_end)
 * - Sorting: ?sortBy=field&order=asc|desc
 * - Search: /resource/search?q=term
 * - Response wrapping: { "products": [...], "total": N, "skip": N, "limit": N }
 * - Create endpoint: POST /resource/add (not just POST /resource)
 */

interface DummyJsonListResponse<T> {
  [key: string]: T[] | number;
  total: number;
  skip: number;
  limit: number;
}

// Map React-Admin resource names to DummyJSON's response keys
// (Usually the same, but this gives flexibility)
const getResourceKey = (resource: string): string => {
  return resource; // products -> products, users -> users, etc.
};

// Some resources support nested reference endpoints
// e.g., /todos/user/5, /posts/user/1, /carts/user/5
const RESOURCES_WITH_USER_REFERENCE = ['todos', 'posts', 'carts', 'comments'];

const httpClient = fetchUtils.fetchJson;

export const dummyJsonDataProvider: DataProvider = {
  /**
   * Get a list of records
   * React-Admin calls: getList('products', { pagination: { page, perPage }, sort: { field, order }, filter })
   * DummyJSON expects: GET /products?limit=10&skip=0&sortBy=title&order=asc
   */
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    const skip = (page - 1) * perPage;

    // Build query params
    const query: Record<string, string> = {
      limit: String(perPage),
      skip: String(skip),
    };

    // Add sorting if specified
    if (field && field !== 'id') {
      query.sortBy = field;
      query.order = order.toLowerCase();
    }

    // Determine endpoint - use search endpoint if 'q' filter is present
    let endpoint = `${API_URL}/${resource}`;
    if (filter?.q) {
      endpoint = `${API_URL}/${resource}/search`;
      query.q = filter.q;
    }

    // Add other filters as select params (DummyJSON doesn't support arbitrary filtering,
    // but we can pass them as query params in case of custom endpoints)
    Object.keys(filter || {}).forEach((key) => {
      if (key !== 'q') {
        query[key] = filter[key];
      }
    });

    const queryString = new URLSearchParams(query).toString();
    const url = `${endpoint}?${queryString}`;

    const { json } = await httpClient(url);

    const resourceKey = getResourceKey(resource);
    let data = json[resourceKey] || [];

    // Handle products/categories specially as it returns an array directly
    if (resource === 'products/categories' && Array.isArray(json)) {
      data = json.map((item: any) =>
        typeof item === 'string' ? { id: item, name: item } : { ...item, id: item.slug || item.name || item },
      );
    }

    const total = json.total ?? data.length;

    return {
      data,
      total,
    };
  },

  /**
   * Get a single record by ID
   * React-Admin calls: getOne('products', { id: 123 })
   * DummyJSON expects: GET /products/123
   */
  getOne: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url);

    return { data: json };
  },

  /**
   * Get multiple records by IDs
   * React-Admin calls: getMany('products', { ids: [1, 2, 3] })
   * DummyJSON doesn't have a bulk endpoint, so we fetch individually
   */
  getMany: async (resource, params) => {
    // Handle categories specifically since they aren't individual endpoints but part of a list
    if (resource === 'products/categories') {
      const url = `${API_URL}/${resource}`;
      const { json } = await httpClient(url);

      const allCategories = Array.isArray(json)
        ? json.map((item: any) =>
            typeof item === 'string' ? { id: item, name: item } : { ...item, id: item.slug || item.name || item },
          )
        : [];

      const data = allCategories.filter((cat) => params.ids.includes(cat.id));
      return { data };
    }

    const promises = params.ids.map((id) => httpClient(`${API_URL}/${resource}/${id}`).then(({ json }) => json));

    const data = await Promise.all(promises);

    return { data };
  },

  /**
   * Get related records (e.g., comments for a post)
   * React-Admin calls: getManyReference('comments', { target: 'postId', id: 1 })
   * DummyJSON supports: GET /comments/post/1, GET /todos/user/5, etc.
   */
  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { target, id } = params;

    const skip = (page - 1) * perPage;

    // DummyJSON uses patterns like /comments/post/1 or /todos/user/5
    // The target format is usually "postId" or "userId", we need to extract "post" or "user"
    const refType = target.replace('Id', '');

    const query: Record<string, string> = {
      limit: String(perPage),
      skip: String(skip),
    };

    if (field && field !== 'id') {
      query.sortBy = field;
      query.order = order.toLowerCase();
    }

    const queryString = new URLSearchParams(query).toString();
    const url = `${API_URL}/${resource}/${refType}/${id}?${queryString}`;

    const { json } = await httpClient(url);

    const resourceKey = getResourceKey(resource);
    const data = json[resourceKey] || [];
    const total = json.total ?? data.length;

    return {
      data,
      total,
    };
  },

  /**
   * Create a new record
   * React-Admin calls: create('products', { data: { title: 'New' } })
   * DummyJSON expects: POST /products/add (note the /add suffix!)
   */
  create: async (resource, params) => {
    const url = `${API_URL}/${resource}/add`;
    let body = params.data;

    if (resource === 'carts') {
      body = {
        userId: params.data.userId,
        products: params.data.products?.map((p: any) => ({
          id: p.id,
          quantity: p.quantity,
        })),
      };
    }

    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return { data: json };
  },

  /**
   * Update a record
   * React-Admin calls: update('products', { id: 1, data: { title: 'Updated' } })
   * DummyJSON expects: PUT /products/1
   */
  update: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    let body = params.data;

    if (resource === 'carts') {
      body = {
        products: params.data.products?.map((p: any) => ({
          id: p.id,
          quantity: p.quantity,
        })),
      };
    }

    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return { data: json };
  },

  /**
   * Update multiple records
   * DummyJSON doesn't support bulk update, so we do individual requests
   */
  updateMany: async (resource, params) => {
    const promises = params.ids.map((id) =>
      httpClient(`${API_URL}/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => json.id),
    );

    const ids = await Promise.all(promises);

    return { data: ids };
  },

  /**
   * Delete a record
   * React-Admin calls: delete('products', { id: 1 })
   * DummyJSON expects: DELETE /products/1
   */
  delete: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;

    const { json } = await httpClient(url, {
      method: 'DELETE',
    });

    return { data: json };
  },

  /**
   * Delete multiple records
   * DummyJSON doesn't support bulk delete, so we do individual requests
   */
  deleteMany: async (resource, params) => {
    const promises = params.ids.map((id) =>
      httpClient(`${API_URL}/${resource}/${id}`, {
        method: 'DELETE',
      }).then(({ json }) => json.id),
    );

    const ids = await Promise.all(promises);

    return { data: ids };
  },
};

export default dummyJsonDataProvider;
