import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReferenceField from './ReferenceField';
import { useRecordContext, useResourceDefinition } from 'ra-core';

// Mock ra-core
vi.mock('ra-core', () => ({
  ReferenceFieldBase: vi.fn(({ children }: any) => <div data-testid="ra-reference-field-base">{children}</div>),
  useRecordContext: vi.fn(),
  useResourceDefinition: vi.fn(),
  ResourceContextProvider: ({ children }: any) => <div data-testid="resource-context-provider">{children}</div>,
}));

// Mock Cloudscape Box
vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('ReferenceField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when provided', () => {
    (useRecordContext as any).mockReturnValue({ id: 1, name: 'Category 1' });
    (useResourceDefinition as any).mockReturnValue({ recordRepresentation: 'name' });

    render(
      <ReferenceField source="categoryId" reference="categories">
        <span data-testid="child">Child Content</span>
      </ReferenceField>
    );

    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByTestId('child').textContent).toBe('Child Content');
  });

  it('should render record representation when no children provided (function)', () => {
    const record = { id: 1, name: 'Category 1' };
    (useRecordContext as any).mockReturnValue(record);
    (useResourceDefinition as any).mockReturnValue({ 
        recordRepresentation: (rec: any) => rec.name 
    });

    render(<ReferenceField source="categoryId" reference="categories" />);

    expect(screen.getByText('Category 1')).toBeDefined();
  });

  it('should render record representation when no children provided (string)', () => {
    const record = { id: 1, name: 'Category 1' };
    (useRecordContext as any).mockReturnValue(record);
    (useResourceDefinition as any).mockReturnValue({ 
        recordRepresentation: 'name' 
    });

    render(<ReferenceField source="categoryId" reference="categories" />);

    expect(screen.getByText('Category 1')).toBeDefined();
  });

  it('should render id if no recordRepresentation is provided', () => {
    const record = { id: 1, name: 'Category 1' };
    (useRecordContext as any).mockReturnValue(record);
    (useResourceDefinition as any).mockReturnValue({});

    render(<ReferenceField source="categoryId" reference="categories" />);

    expect(screen.getByText('1')).toBeDefined();
  });
});
