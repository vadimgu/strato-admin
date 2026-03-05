import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import {
    type BaseFieldProps,
    type RaRecord,
    useFieldValue,
    useRecordContext,
    useLocale,
} from 'ra-core';
import FieldLink, { type FieldLinkType } from './FieldLink';

export type DateFieldProps<RecordType extends RaRecord = RaRecord> =
    BaseFieldProps<RecordType> &
        Omit<BoxProps, 'children'> & {
            emptyText?: ReactNode;
            options?: Intl.DateTimeFormatOptions;
            locales?: string | string[];
            link?: FieldLinkType;
        };

const DateField = <RecordType extends RaRecord = RaRecord>(
    props: DateFieldProps<RecordType>
) => {
    const { source, record: recordProp, emptyText, options, locales, link, ...boxProps } = props;
    const record = useRecordContext<RecordType>({ record: recordProp });
    const value = useFieldValue<RecordType>({ source, record });
    const currentLocale = useLocale();
    const hasValue = value !== null && value !== undefined && value !== '';

    if (!hasValue) {
        return <Box {...boxProps}>{emptyText ?? null}</Box>;
    }

    const dateValue = value instanceof Date ? value : new Date(value);
    const formattedValue = new Intl.DateTimeFormat(locales || currentLocale, options).format(dateValue);

    return (
        <Box {...boxProps}>
            <FieldLink link={link}>
                {formattedValue}
            </FieldLink>
        </Box>
    );
};

export default DateField;
