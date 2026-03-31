import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrayInput } from './ArrayInput';
import TextInput from './TextInput';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      items: [{ name: 'Item 1' }, { name: 'Item 2' }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ArrayInput', () => {
  it('should render items from default values', () => {
    render(
      <TestWrapper>
        <ArrayInput source="items">
          <TextInput source="name" label="Name" />
        </ArrayInput>
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue('Item 1')).toBeDefined();
    expect(screen.getByDisplayValue('Item 2')).toBeDefined();
  });

  it('should add a new item when clicking the add button', async () => {
    render(
      <TestWrapper>
        <ArrayInput source="items" addButtonText="Add new one">
          <TextInput source="name" label="Name" />
        </ArrayInput>
      </TestWrapper>,
    );

    const addButton = screen.getByText('Add new one');
    fireEvent.click(addButton);

    // AttributeEditor might have some internal delay or we need to wait for react-hook-form
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(3);
    });
  });

  it('should remove an item when clicking the remove button', async () => {
    render(
      <TestWrapper>
        <ArrayInput source="items" removeButtonText="Remove this">
          <TextInput source="name" label="Name" />
        </ArrayInput>
      </TestWrapper>,
    );

    const removeButtons = screen.getAllByText('Remove this');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(1);
    });
  });

  it('should support gridLayout prop', () => {
    // This is mostly a smoke test to ensure the prop doesn't crash
    const gridLayout = [{ rows: [[1]] }];
    render(
      <TestWrapper>
        <ArrayInput source="items" gridLayout={gridLayout}>
          <TextInput source="name" label="Name" />
        </ArrayInput>
      </TestWrapper>,
    );

    expect(screen.getByDisplayValue('Item 1')).toBeDefined();
  });
});
