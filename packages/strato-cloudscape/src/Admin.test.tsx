import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Admin } from './Admin';
import { Resource } from '@strato-admin/core';

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
