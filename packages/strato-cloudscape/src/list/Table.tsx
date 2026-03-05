import React from 'react';
import CloudscapeTable, { TableProps as CloudscapeTableProps } from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import { RecordContextProvider, RaRecord, useResourceContext, useTranslate } from 'ra-core';
import { useCollection } from '../collection-hooks';
import TextField from '../field/TextField';
import NumberField, { type NumberFieldProps } from '../field/NumberField';
import ReferenceField, { type ReferenceFieldProps } from '../field/ReferenceField';
import { type FieldLinkType } from '../field/FieldLink';
import { ListHeader } from './ListHeader';

export interface ColProps {
    source?: string;
    label?: string;
    header?: React.ReactNode;
    children?: React.ReactNode;
    sortable?: boolean;
    link?: FieldLinkType;
}

export const Col = ({ children, source, link }: ColProps) => {
    if (children) {
        return <>{children}</>;
    }
    if (source) {
        return <TextField source={source} link={link} />;
    }
    return null;
};

export interface NumberColProps extends ColProps, Omit<NumberFieldProps, 'source'> {
    source?: string;
}

export const NumberCol = ({ children, source, link, ...props }: NumberColProps) => {
    if (children) {
        return (
            <Box textAlign="right" {...props}>
                {children}
            </Box>
        );
    }
    if (source) {
        return <NumberField source={source} textAlign="right" link={link} {...props} />;
    }
    return null;
};
(NumberCol as any).isNumberCol = true;

export interface ReferenceColProps extends ColProps, Omit<ReferenceFieldProps, 'source'> {
    source?: string;
    reference: string;
}

export const ReferenceCol = ({ children, source, reference, link, ...props }: ReferenceColProps) => {
    if (source) {
        return (
            <ReferenceField source={source} reference={reference} link={link} {...props}>
                {children}
            </ReferenceField>
        );
    }
    return null;
};

export interface DataTableProps<RecordType extends RaRecord = any> extends Partial<Omit<CloudscapeTableProps<RecordType>, 'items' | 'columnDefinitions'>> {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export const DataTable = <RecordType extends RaRecord = any>({
    header,
    children,
    ...props
}: DataTableProps<RecordType>) => {
    const resource = useResourceContext();
    const translate = useTranslate();
    const { items, paginationProps, collectionProps } = useCollection<RecordType>({
        filtering: {},
        pagination: {},
        sorting: {},
    });

    const columnDefinitions =
        React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
                return null;
            }

            const { source, label, header: childHeader, sortable } = child.props as any;
            const isNumberCol = (child.type as any)?.isNumberCol;

            const headerLabel = childHeader || label || (source && resource ? translate(`resources.${resource}.fields.${source}`, { _: source }) : source);
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
                sortingField: sortable !== false ? source : undefined,
            };
        })?.filter((col): col is Exclude<typeof col, null> => col !== null) || [];

    return (
        <CloudscapeTable
            {...collectionProps}
            {...props}
            columnDefinitions={columnDefinitions}
            items={items || []}
            header={
                header 
                    ? React.isValidElement(header)
                        ? header
                        : <ListHeader title={header} /> 
                    : <ListHeader />
            }
            pagination={<Pagination {...paginationProps} />}
        />
    );
};

DataTable.Col = Col;
DataTable.NumberCol = NumberCol;
DataTable.ReferenceCol = ReferenceCol;

export const Table = DataTable;

export default DataTable;
