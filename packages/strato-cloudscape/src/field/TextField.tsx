import type { ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    type FieldProps,
    type RaRecord,
    useFieldValue,
    useRecordContext,
} from 'ra-core';

export type TextFieldProps<RecordType extends RaRecord = RaRecord> =
    FieldProps<RecordType> &
        Omit<BoxProps, 'children'> & {
            emptyText?: ReactNode;
        };

const TextField = <RecordType extends RaRecord = RaRecord>(
    props: TextFieldProps<RecordType>
) => {
    const { source, record: recordProp, emptyText, ...boxProps } = props;
    const record = useRecordContext<RecordType>({ record: recordProp });
    const value = useFieldValue<RecordType>({ source, record });
    const hasValue = value !== null && value !== undefined && value !== '';

    return (
        <Box {...boxProps}>{hasValue ? String(value) : (emptyText ?? null)}</Box>
    );
};

export default TextField;
