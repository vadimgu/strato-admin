import React, { type ReactNode } from 'react';
import Box, { type BoxProps } from '@cloudscape-design/components/box';
import { type BaseFieldProps, type RaRecord, useFieldValue, useRecordContext } from 'ra-core';
import FieldLink, { type FieldLinkType } from './FieldLink';
import { useFieldContext } from './FieldContext';

export type TextFieldProps<RecordType extends RaRecord = RaRecord> = BaseFieldProps<RecordType> &
  Omit<BoxProps, 'children'> & {
    label?: ReactNode;
    emptyText?: ReactNode;
    link?: FieldLinkType;
  };

const TextField = <RecordType extends RaRecord = RaRecord>(props: TextFieldProps<RecordType>) => {
  const fieldContext = useFieldContext();
  const source = props.source ?? fieldContext?.source;
  const { record: recordProp, emptyText, link, ...boxProps } = props;
  
  // if source is undefined, useFieldValue might complain or just return undefined. 
  // ra-core useFieldValue expects source to be a string normally, but lets pass it anyway.
  // Wait, if source is undefined, value will be undefined.
  const record = useRecordContext<RecordType>({ record: recordProp });
  const value = useFieldValue<RecordType>({ source: source as string, record });
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <Box {...boxProps}>
      <FieldLink link={link}>{hasValue ? String(value) : (emptyText ?? null)}</FieldLink>
    </Box>
  );
};

export default TextField;
