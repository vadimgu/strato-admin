import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AppLayout } from './AppLayout';
import { useDefaultTitle, useResourceDefinitions } from 'strato-core';
import { TopNavigation } from './TopNavigation';

// Mock strato-core
vi.mock('strato-core', () => ({
  useDefaultTitle: vi.fn(),
  useResourceDefinitions: vi.fn(() => ({})),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useStore: vi.fn(() => ['light', vi.fn()]),
}));

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
  default: () => <div data-testid="side-navigation" />,
}));

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
