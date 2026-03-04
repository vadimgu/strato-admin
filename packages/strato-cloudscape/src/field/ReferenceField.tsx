import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    ReferenceFieldBase,
    type RaRecord,
    useRecordContext,
    useResourceDefinition,
} from 'ra-core';

export type ReferenceFieldProps<RecordType extends RaRecord = RaRecord> =
    Omit<BoxProps, 'children'> & {
        source: string;
        reference: string;
        children?: ReactNode;
        emptyText?: ReactNode;
        record?: RecordType;
    };

const ReferenceField = <RecordType extends RaRecord = RaRecord>(
    props: ReferenceFieldProps<RecordType>
) => {
    const {
        source,
        reference,
        children,
        emptyText,
        record,
        ...boxProps
    } = props;

    return (
        <ReferenceFieldBase
            source={source}
            reference={reference}
            record={record}
            empty={<Box {...boxProps}>{emptyText ?? null}</Box>}
        >
            <ReferenceFieldValue emptyText={emptyText} {...boxProps}>
                {children}
            </ReferenceFieldValue>
        </ReferenceFieldBase>
    );
};

const ReferenceFieldValue = ({ children, emptyText, ...boxProps }: any) => {
    const record = useRecordContext();
    const { recordRepresentation } = useResourceDefinition();

    if (!record) {
        return <Box {...boxProps}>{emptyText ?? null}</Box>;
    }

    if (children) {
        return <Box {...boxProps}>{children}</Box>;
    }

    let representation: ReactNode = '';
    if (typeof recordRepresentation === 'function') {
        representation = recordRepresentation(record);
    } else if (typeof recordRepresentation === 'string') {
        representation = record[recordRepresentation];
    } else {
        representation = record.id;
    }

    return (
        <Box {...boxProps}>
            {representation ? String(representation) : (emptyText ?? null)}
        </Box>
    );

};

export default ReferenceField;
