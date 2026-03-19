import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAuthProvider } from '@strato-admin/core';
import CloudscapeTopNavigation from '@cloudscape-design/components/top-navigation';
import TopNavigation from './TopNavigation';

// Mock ra-core
vi.mock('@strato-admin/core', () => ({
  useLocale: vi.fn(() => 'en'),
  useSetLocale: vi.fn(),
  useLocales: vi.fn(() => []),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useAuthProvider: vi.fn(),
  useStore: vi.fn(() => ['light', vi.fn()]),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/top-navigation', () => ({
  default: vi.fn(() => <div data-testid="top-navigation" />),
}));

// Mock global-styles
vi.mock('@cloudscape-design/global-styles', () => ({
  Mode: { Light: 'light', Dark: 'dark' },
  applyMode: vi.fn(),
}));

describe('TopNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display theme toggle', () => {
    render(<TopNavigation />);

    const navigationProps = (CloudscapeTopNavigation as any).mock.calls[0][0];
    const themeToggle = navigationProps.utilities.find((u: any) => u.iconSvg !== undefined);
    expect(themeToggle).toBeDefined();
    expect(themeToggle.type).toBe('button');
  });

  it('should not display user menu when authProvider is missing', () => {
    (useAuthProvider as any).mockReturnValue(undefined);

    render(<TopNavigation />);

    const navigationProps = (CloudscapeTopNavigation as any).mock.calls[0][0];
    const userMenu = navigationProps.utilities.find((u: any) => u.iconName === 'user-profile');
    expect(userMenu).toBeUndefined();
  });

  it('should display user menu when authProvider is present', () => {
    (useAuthProvider as any).mockReturnValue({});

    render(<TopNavigation />);

    const navigationProps = (CloudscapeTopNavigation as any).mock.calls[0][0];
    const userMenu = navigationProps.utilities.find((u: any) => u.iconName === 'user-profile');
    expect(userMenu).toBeDefined();
    expect(userMenu.text).toBe('User'); // Based on mock translate returning default value
  });

  it('should use provided identity', () => {
    render(<TopNavigation identity={{ title: 'Custom Title', href: '/custom' }} />);

    const navigationProps = (CloudscapeTopNavigation as any).mock.calls[0][0];
    expect(navigationProps.identity).toEqual({ title: 'Custom Title', href: '/custom' });
  });

  it('should use provided utilities', () => {
    const customUtilities = [{ type: 'button' as const, text: 'Custom' }];
    render(<TopNavigation utilities={customUtilities} />);

    const navigationProps = (CloudscapeTopNavigation as any).mock.calls[0][0];
    expect(navigationProps.utilities).toEqual(customUtilities);
  });
});
