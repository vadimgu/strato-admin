import React from 'react';
import CloudscapeKeyValuePairs, {
  type KeyValuePairsProps as CloudscapeKeyValuePairsProps,
} from '@cloudscape-design/components/key-value-pairs';
import { useResourceContext, useRecordContext, FieldTitle, RecordContextProvider, type RaRecord } from 'ra-core';
import TextField from '../field/TextField';
import { FieldContext } from '../field/FieldContext';

export interface KeyValuePairsProps extends Partial<Omit<CloudscapeKeyValuePairsProps, 'items'>> {
  children: React.ReactNode;
  columns?: number;
  minColumnWidth?: number;
}

export interface KeyValueFieldProps {
  source?: string;
  label?: string;
  children?: React.ReactNode;
  field?: React.ComponentType<any>;
}

/**
 * KeyValuePairs.Field is a helper component to define a field in a KeyValuePairs component.
 * It mirrors the DataTable.Col pattern.
 */
export const KeyValueField = ({ children, source, field: FieldComponent }: KeyValueFieldProps) => {
  const content = children ? (
    <>{children}</>
  ) : FieldComponent ? (
    <FieldComponent />
  ) : (
    <TextField />
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};

/**
 * A KeyValuePairs component that mirrors the Cloudscape KeyValuePairs component
 * but automatically handles labels and record context for its children.
 *
 * @example
 * <KeyValuePairs columns={2}>
 *   <TextField source="name" label="Full Name" />
 *   <KeyValuePairs.Field source="age" label="Age" />
 * </KeyValuePairs>
 */
export const KeyValuePairs = <RecordType extends RaRecord = RaRecord>({
  children,
  columns,
  minColumnWidth,
  ...props
}: KeyValuePairsProps) => {
  const resource = useResourceContext();
  const record = useRecordContext<RecordType>();

  const items =
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      const { source, label } = child.props as any;
      return {
        label: <FieldTitle source={source} resource={resource} label={label} />,
        value: <RecordContextProvider value={record}>{child}</RecordContextProvider>,
      };
    })?.filter((item): item is Exclude<typeof item, null> => item !== null) || [];

  return <CloudscapeKeyValuePairs {...props} items={items} columns={columns} minColumnWidth={minColumnWidth} />;
};

KeyValuePairs.Field = KeyValueField;

export default KeyValuePairs;
