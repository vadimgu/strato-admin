import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SimpleForm } from './SimpleForm';

// Mock ra-core
vi.mock('ra-core', () => ({
  Form: ({ children }: any) => <div data-testid="ra-form">{children}</div>,
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useSaveContext: vi.fn(() => ({ save: vi.fn() })),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/form', () => ({
  default: ({ children, actions }: any) => (
    <div data-testid="cloudscape-form">
      <div data-testid="form-content">{children}</div>
      <div data-testid="form-actions">{actions}</div>
    </div>
  ),
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@cloudscape-design/components/button', () => ({
  default: ({ children, type }: any) => <button type={type}>{children}</button>,
}));

describe('SimpleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children and default toolbar', () => {
    const { getByTestId, getByText } = render(
      <SimpleForm>
        <div data-testid="child" />
      </SimpleForm>,
    );

    expect(getByTestId('ra-form')).toBeDefined();
    expect(getByTestId('cloudscape-form')).toBeDefined();
    expect(getByTestId('child')).toBeDefined();
    expect(getByText('Save')).toBeDefined();
  });

  it('should render custom toolbar', () => {
    const { getByText, queryByText } = render(
      <SimpleForm toolbar={<button>Custom Save</button>}>
        <div />
      </SimpleForm>,
    );

    expect(getByText('Custom Save')).toBeDefined();
    expect(queryByText('Save')).toBeNull();
  });
});
