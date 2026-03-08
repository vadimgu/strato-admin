import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext } from 'ra-core';
import FieldLink, { type FieldLinkType } from './FieldLink';

export type TextFieldProps<RecordType extends RaRecord = RaRecord> = BaseFieldProps<RecordType> &
  Omit<BoxProps, 'children'> & {
    label?: ReactNode;
    emptyText?: ReactNode;
    link?: FieldLinkType;
  };

const TextField = <RecordType extends RaRecord = RaRecord>(props: TextFieldProps<RecordType>) => {
  const { source, record: recordProp, emptyText, link, ...boxProps } = props;
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source, record });
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <Box {...boxProps}>
      <FieldLink link={link}>{hasValue ? String(value) : (emptyText ?? null)}</FieldLink>
    </Box>
  );
};

export default TextField;
