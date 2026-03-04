import type { ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    type FieldProps,
    type RaRecord,
    useFieldValue,
    useRecordContext,
} from 'ra-core';

export type NumberFieldProps<RecordType extends RaRecord = RaRecord> =
    FieldProps<RecordType> &
        Omit<BoxProps, 'children'> & {
            emptyText?: ReactNode;
            options?: Intl.NumberFormatOptions;
            locales?: string | string[];
        };

const NumberField = <RecordType extends RaRecord = RaRecord>(
    props: NumberFieldProps<RecordType>
) => {
    const { source, record: recordProp, emptyText, options, locales, ...boxProps } = props;
    const record = useRecordContext<RecordType>({ record: recordProp });
    const value = useFieldValue<RecordType>({ source, record });
    const hasValue = value !== null && value !== undefined && value !== '';

    if (!hasValue) {
        return <Box {...boxProps}>{emptyText ?? null}</Box>;
    }

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    const formattedValue = new Intl.NumberFormat(locales, options).format(numberValue);

    return (
        <Box {...boxProps}>{formattedValue}</Box>
    );
};

export default NumberField;
