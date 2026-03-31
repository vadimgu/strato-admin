import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AppLayout } from './AppLayout';
import { useDefaultTitle, useResourceDefinitions } from '@strato-admin/ra-core';
import { TopNavigation } from './TopNavigation';
import SideNavigationMock from '@cloudscape-design/components/side-navigation';

vi.mock('@strato-admin/ra-core', () => import('../__mocks__/ra-core'));
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock global-styles
vi.mock('@cloudscape-design/global-styles', () => ({
  Mode: { Light: 'light', Dark: 'dark' },
  applyMode: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock TopNavigation
vi.mock('./TopNavigation', () => ({
  TopNavigation: vi.fn(() => <div data-testid="top-navigation" />),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/app-layout', () => ({
  default: ({ navigation, content }: any) => (
    <div>
      <div data-testid="navigation">{navigation}</div>
      <div data-testid="content">{content}</div>
    </div>
  ),
}));

vi.mock('@cloudscape-design/components/side-navigation', () => ({
  default: vi.fn(() => <div data-testid="side-navigation" />),
}));

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should only show resources with hasList: true in SideNavigation', () => {
    (useResourceDefinitions as any).mockReturnValue({
      posts: { name: 'posts', hasList: true },
      comments: { name: 'comments', hasList: false },
      users: { name: 'users', hasList: true },
    });

    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    const sideNavProps = vi.mocked(SideNavigationMock).mock.calls[0][0];
    expect(sideNavProps.items).toHaveLength(2);
    expect(sideNavProps.items[0]).toMatchObject({ text: 'posts', href: '/posts' });
    expect(sideNavProps.items[1]).toMatchObject({ text: 'users', href: '/users' });
  });

  it('should use title from useDefaultTitle hook if no title prop provided', () => {
    (useDefaultTitle as any).mockReturnValue('Hook Title');

    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    expect(vi.mocked(TopNavigation).mock.calls[0][0]).toMatchObject({
      identity: { title: 'Hook Title' },
    });
  });

  it('should prioritize title prop over useDefaultTitle hook', () => {
    (useDefaultTitle as any).mockReturnValue('Hook Title');

    render(
      <AppLayout title="Prop Title">
        <div>Content</div>
      </AppLayout>,
    );

    expect(vi.mocked(TopNavigation).mock.calls[0][0]).toMatchObject({
      identity: { title: 'Prop Title' },
    });
  });

  it('should handle undefined default title', () => {
    (useDefaultTitle as any).mockReturnValue(undefined);

    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    expect(vi.mocked(TopNavigation).mock.calls[0][0]).toMatchObject({
      identity: { title: '' },
    });
  });
});
