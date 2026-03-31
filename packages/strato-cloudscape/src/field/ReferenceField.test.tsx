import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReferenceField from './ReferenceField';
import { useRecordContext, useGetRecordRepresentation } from '@strato-admin/ra-core';

// Mock ra-core
vi.mock('@strato-admin/ra-core', () => ({
  ReferenceFieldBase: vi.fn(({ children }: any) => <div data-testid="ra-reference-field-base">{children}</div>),
  useRecordContext: vi.fn(),
  useGetRecordRepresentation: vi.fn(),
  useResourceDefinition: vi.fn(),
  useResourceContext: vi.fn(() => 'categories'),
  ResourceContextProvider: ({ children }: any) => <div data-testid="resource-context-provider">{children}</div>,
}));

// Mock strato-core
vi.mock('@strato-admin/core', () => ({
  useCreatePath: vi.fn(() => (params: any) => {
    if (params.type === 'detail') return `/${params.resource}/${params.id}`;
    if (params.type === 'edit') return `/${params.resource}/${params.id}/edit`;
    if (params.type === 'create') return `/${params.resource}/create`;
    return `/${params.resource}`;
  }),
  useResourceSchema: vi.fn(() => ({ queryOptions: undefined })),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Cloudscape Box
vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock Cloudscape Link
vi.mock('@cloudscape-design/components/link', () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid="cloudscape-link">
      {children}
    </a>
  ),
}));

describe('ReferenceField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when provided', () => {
    (useRecordContext as any).mockReturnValue({ id: 1, name: 'Category 1' });
    (useGetRecordRepresentation as any).mockReturnValue(() => 'Category 1');

    render(
      <ReferenceField source="categoryId" reference="categories">
        <span data-testid="child">Child Content</span>
      </ReferenceField>,
    );

    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByTestId('child').textContent).toBe('Child Content');
  });

  it('should render record representation when no children provided', () => {
    const record = { id: 1, name: 'Category 1' };
    (useRecordContext as any).mockReturnValue(record);
    (useGetRecordRepresentation as any).mockReturnValue((rec: any) => rec.name);

    render(<ReferenceField source="categoryId" reference="categories" />);

    expect(screen.getByText('Category 1')).toBeDefined();
  });

  it('should render id if no other representation is provided', () => {
    const record = { id: 1 };
    (useRecordContext as any).mockReturnValue(record);
    (useGetRecordRepresentation as any).mockReturnValue((rec: any) => `#${rec.id}`);

    render(<ReferenceField source="categoryId" reference="categories" />);

    expect(screen.getByText('#1')).toBeDefined();
  });

  it('should render a link when link prop is provided', () => {
    const record = { id: 1, name: 'Category 1' };
    (useRecordContext as any).mockReturnValue(record);
    (useGetRecordRepresentation as any).mockReturnValue(() => 'Category 1');

    render(<ReferenceField source="categoryId" reference="categories" link="detail" />);

    const link = screen.getByTestId('cloudscape-link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/categories/1');
    expect(link.textContent).toBe('Category 1');
  });
});
