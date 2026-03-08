import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Admin } from './Admin';
import { Resource } from 'ra-core';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  useParams: vi.fn(),
  useHref: vi.fn(),
  useResolvedPath: vi.fn(),
  useLinkClickHandler: vi.fn(),
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  MemoryRouter: ({ children }: any) => <div>{children}</div>,
  useMatches: vi.fn(() => []),
  useInRouterContext: vi.fn(() => true),
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: () => null,
}));

// Mock Cloudscape TopNavigation
vi.mock('./layout/TopNavigation', () => ({
  TopNavigation: () => <div data-testid="top-nav" />,
}));

describe('Admin', () => {
  it('should render without crashing when no i18nProvider is provided', () => {
    const dataProvider = {
      getList: () => Promise.resolve({ data: [], total: 0 }),
      getOne: () => Promise.resolve({ data: {} }),
      getMany: () => Promise.resolve({ data: [] }),
      getManyReference: () => Promise.resolve({ data: [], total: 0 }),
      update: () => Promise.resolve({ data: {} }),
      updateMany: () => Promise.resolve({ data: [] }),
      create: () => Promise.resolve({ data: {} }),
      delete: () => Promise.resolve({ data: {} }),
      deleteMany: () => Promise.resolve({ data: [] }),
    } as any;

    render(
      <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={() => <div>Posts List</div>} />
      </Admin>,
    );
  });
});
