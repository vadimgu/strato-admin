import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    ReferenceFieldBase,
    type RaRecord,
    useRecordContext,
    useResourceDefinition,
} from 'ra-core';
import FieldLink, { type FieldLinkType } from './FieldLink';

export type ReferenceFieldProps<RecordType extends RaRecord = RaRecord> =
    Omit<BoxProps, 'children'> & {
        source: string;
        reference: string;
        children?: ReactNode;
        emptyText?: ReactNode;
        record?: RecordType;
        link?: FieldLinkType;
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
        link,
        ...boxProps
    } = props;

    return (
        <ReferenceFieldBase
            source={source}
            reference={reference}
            record={record}
            empty={<Box {...boxProps}>{emptyText ?? null}</Box>}
        >
            <ReferenceFieldValue emptyText={emptyText} link={link} {...boxProps}>
                {children}
            </ReferenceFieldValue>
        </ReferenceFieldBase>
    );
};

const ReferenceFieldValue = ({ children, emptyText, link, ...boxProps }: any) => {
    const record = useRecordContext();
    const { recordRepresentation } = useResourceDefinition();

    if (!record) {
        return <Box {...boxProps}>{emptyText ?? null}</Box>;
    }

    if (children) {
        return (
            <Box {...boxProps}>
                <FieldLink link={link}>
                    {children}
                </FieldLink>
            </Box>
        );
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
            <FieldLink link={link}>
                {representation ? String(representation) : (emptyText ?? null)}
            </FieldLink>
        </Box>
    );

};

export default ReferenceField;
