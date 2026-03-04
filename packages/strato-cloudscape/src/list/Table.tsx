import React from 'react';
import CloudscapeTable from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import { RecordContextProvider, RaRecord, useResourceContext } from 'ra-core';
import { useCollection } from '../collection-hooks';
import TextField from '../field/TextField';
import NumberField, { type NumberFieldProps } from '../field/NumberField';
import ReferenceField, { type ReferenceFieldProps } from '../field/ReferenceField';

export interface ColProps {
    source?: string;
    label?: string;
    header?: React.ReactNode;
    children?: React.ReactNode;
}

export const Col = ({ children, source }: ColProps) => {
    if (children) {
        return <>{children}</>;
    }
    if (source) {
        return <TextField source={source} />;
    }
    return null;
};

export interface NumberColProps extends ColProps, Omit<NumberFieldProps, 'source'> {
    source?: string;
}

export const NumberCol = ({ children, source, ...props }: NumberColProps) => {
    if (children) {
        return (
            <Box textAlign="right" {...props}>
                {children}
            </Box>
        );
    }
    if (source) {
        return <NumberField source={source} textAlign="right" {...props} />;
    }
    return null;
};
(NumberCol as any).isNumberCol = true;

export interface ReferenceColProps extends ColProps, Omit<ReferenceFieldProps, 'source'> {
    source?: string;
    reference: string;
}

export const ReferenceCol = ({ children, source, reference, ...props }: ReferenceColProps) => {
    if (source) {
        return (
            <ReferenceField source={source} reference={reference} {...props}>
                {children}
            </ReferenceField>
        );
    }
    return null;
};

export interface DataTableProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export const DataTable = <RecordType extends RaRecord = any>({
    header,
    children,
}: DataTableProps) => {
    const resource = useResourceContext();
    const { items, paginationProps } = useCollection<RecordType>({
        filtering: {},
        pagination: {},
        sorting: {},
    });

    const columnDefinitions =
        React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
                return null;
            }

            const { source, label, header: childHeader } = child.props as any;
            const isNumberCol = (child.type as any)?.isNumberCol;

            const headerLabel = childHeader || label || source;
            const finalHeader = isNumberCol ? (
                <Box textAlign="right">{headerLabel}</Box>
            ) : (
                headerLabel
            );

            const columnId = source || `col-${index}`;
            const id = resource ? `${resource}___${columnId}` : columnId;

            return {
                id,
                header: finalHeader,
                cell: (item: RecordType) => (
                    <RecordContextProvider value={item}>
                        {child as React.ReactElement}
                    </RecordContextProvider>
                ),
            };
        })?.filter((col): col is Exclude<typeof col, null> => col !== null) || [];

    return (
        <CloudscapeTable
            columnDefinitions={columnDefinitions}
            items={items || []}
            header={header && <Header>{header}</Header>}
            pagination={<Pagination {...paginationProps} />}
        />
    );
};

DataTable.Col = Col;
DataTable.NumberCol = NumberCol;
DataTable.ReferenceCol = ReferenceCol;

export const Table = DataTable;

export default DataTable;
