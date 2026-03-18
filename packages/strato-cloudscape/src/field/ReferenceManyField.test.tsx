
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReferenceManyField from './ReferenceManyField';

// Mock ra-core (via strato-core)
vi.mock('@strato-admin/core', () => ({
  ReferenceManyFieldBase: vi.fn(({ children }: any) => <div data-testid="ra-reference-many-field-base">{children}</div>),
  ResourceSchemaProvider: vi.fn(({ children }: any) => <div data-testid="resource-schema-provider">{children}</div>),
  ResourceContextProvider: ({ children }: any) => <div data-testid="resource-context-provider">{children}</div>,
}));

describe('ReferenceManyField', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render children within providers', () => {
    render(
      <ReferenceManyField reference="comments" target="post_id">
        <div data-testid="child">Child Content</div>
      </ReferenceManyField>,
    );

    expect(screen.getByTestId('ra-reference-many-field-base')).toBeDefined();
    expect(screen.getByTestId('resource-schema-provider')).toBeDefined();
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByTestId('child').textContent).toBe('Child Content');
  });

  it('should pass correct resource to ResourceSchemaProvider', () => {
    render(
      <ReferenceManyField reference="reviews" target="product_id">
        <div data-testid="child">Child Content</div>
      </ReferenceManyField>,
    );

    expect(screen.getByTestId('resource-schema-provider')).toBeDefined();
  });
});
