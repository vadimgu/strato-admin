import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { SimpleFormIterator } from './SimpleFormIterator';
import { ArrayInputContext } from 'ra-core';

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/attribute-editor', () => ({
    default: ({ items, definition, onAddButtonClick }: any) => (
        <div data-testid="attribute-editor">
            <button onClick={onAddButtonClick}>Add item</button>
            {items.map((item: any, index: number) => (
                <div key={index} data-testid={`item-${index}`}>
                    {definition[0].control(item, index)}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('@cloudscape-design/components/box', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

describe('SimpleFormIterator', () => {
    it('should prefix source prop of immediate children', () => {
        const Child = ({ source }: any) => <div data-testid="child">{source}</div>;
        const contextValue = {
            source: 'products',
            fields: [{}],
            append: vi.fn(),
            remove: vi.fn(),
        };

        const { getByTestId } = render(
            <ArrayInputContext.Provider value={contextValue}>
                <SimpleFormIterator>
                    <Child source="id" />
                </SimpleFormIterator>
            </ArrayInputContext.Provider>
        );

        expect(getByTestId('child').textContent).toBe('products.0.id');
    });

    it('should NOT add source prop to children that do not have one', () => {
        const NonInput = ({ children }: any) => <div data-testid="non-input">{children}</div>;
        const contextValue = {
            source: 'products',
            fields: [{}],
            append: vi.fn(),
            remove: vi.fn(),
        };

        const { getByTestId } = render(
            <ArrayInputContext.Provider value={contextValue}>
                <SimpleFormIterator>
                    <NonInput />
                </SimpleFormIterator>
            </ArrayInputContext.Provider>
        );

        expect(getByTestId('non-input').getAttribute('source')).toBeNull();
    });
});
