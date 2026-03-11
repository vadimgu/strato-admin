import React, { useMemo, useContext } from 'react';
import { ArrayInputContext, RecordContextProvider, useResourceContext } from 'ra-core';
import AttributeEditor from '@cloudscape-design/components/attribute-editor';
import Box from '@cloudscape-design/components/box';
import { FieldTitle } from './FieldTitle';

export interface SimpleFormIteratorProps {
    children: React.ReactNode;
}

export const SimpleFormIterator = (props: SimpleFormIteratorProps) => {
    const { children } = props;
    const context = useContext(ArrayInputContext) as any;

    if (!context) {
        throw new Error('SimpleFormIterator must be used inside an ArrayInput');
    }

    const { source, fields, append, remove } = context;
    const resource = useResourceContext();

    const handleAdd = () => {
        append({});
    };

    const handleRemove = (index: number) => {
        remove(index);
    };

    const definition = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            const childProps = child.props as { source?: string; label?: string | false };

            return {
                label: (
                    <FieldTitle
                        label={childProps.label}
                        source={childProps.source}
                        resource={resource}
                        isRequired={false}
                    />
                ),
                control: (item: any, index: number) => {
                    return (
                        <RecordContextProvider value={item}>
                            <Box padding={{ top: 's' }}>
                                {React.cloneElement(child as React.ReactElement<any>, {
                                    source: `${source}.${index}.${childProps.source}`,
                                    label: false,
                                } as any)}
                            </Box>
                        </RecordContextProvider>
                    );
                },
            };
        })?.filter(Boolean) as any[];
    }, [children, source, resource]);

    return (
        <AttributeEditor
            items={fields}
            definition={definition}
            onAddButtonClick={handleAdd}
            onRemoveButtonClick={({ detail: { itemIndex } }) => handleRemove(itemIndex)}
            empty={<Box textAlign="center" color="inherit">No items added yet.</Box>}
            addButtonText="Add item"
            removeButtonText="Remove item"
        />
    );
};

export default SimpleFormIterator;
