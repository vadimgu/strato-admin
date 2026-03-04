import type { ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    type FieldProps,
    type RaRecord,
    useFieldValue,
    useRecordContext,
} from 'ra-core';

export type DateFieldProps<RecordType extends RaRecord = RaRecord> =
    FieldProps<RecordType> &
        Omit<BoxProps, 'children'> & {
            emptyText?: ReactNode;
            options?: Intl.DateTimeFormatOptions;
            locales?: string | string[];
        };

const DateField = <RecordType extends RaRecord = RaRecord>(
    props: DateFieldProps<RecordType>
) => {
    const { source, record: recordProp, emptyText, options, locales, ...boxProps } = props;
    const record = useRecordContext<RecordType>({ record: recordProp });
    const value = useFieldValue<RecordType>({ source, record });
    const hasValue = value !== null && value !== undefined && value !== '';

    if (!hasValue) {
        return <Box {...boxProps}>{emptyText ?? null}</Box>;
    }

    const dateValue = value instanceof Date ? value : new Date(value);
    const formattedValue = new Intl.DateTimeFormat(locales, options).format(dateValue);

    return (
        <Box {...boxProps}>{formattedValue}</Box>
    );
};

export default DateField;
