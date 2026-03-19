import React from 'react';
import CloudscapeKeyValuePairs, {
  type KeyValuePairsProps as CloudscapeKeyValuePairsProps,
} from '@cloudscape-design/components/key-value-pairs';
import {
  useRecordContext,
  FieldTitle,
  RecordContextProvider,
  type RaRecord,
  useResourceSchema,
} from '@strato-admin/core';
import TextField from '../field/TextField';

export interface KeyValuePairsProps extends Partial<Omit<CloudscapeKeyValuePairsProps, 'items'>> {
  children?: React.ReactNode;
  include?: string[];
  exclude?: string[];
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
  if (children) {
    return (
      <>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { source } as any) : child
        )}
      </>
    );
  }
  if (FieldComponent) {
    return <FieldComponent source={source} />;
  }
  return <TextField source={source} />;
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
  include,
  exclude,
  columns = 3, // Default to 3 columns if not specified
  minColumnWidth,
  ...props
}: KeyValuePairsProps) => {
  const record = useRecordContext<RecordType>();
  const { resource, fieldSchema: schemaChildren } = useResourceSchema();

  const finalChildren = React.useMemo(() => {
    const baseChildren = children || schemaChildren;
    let result = React.Children.toArray(baseChildren);

    if (include) {
      result = result.filter(
        (child) => React.isValidElement(child) && include.includes((child.props as any).source)
      );
    } else if (exclude) {
      result = result.filter(
        (child) => React.isValidElement(child) && !exclude.includes((child.props as any).source)
      );
    }

    return result;
  }, [children, schemaChildren, include, exclude]);

  const items =
    React.Children.map(finalChildren, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      const { source, label } = child.props as any;
      return {
        label: <FieldTitle source={source} resource={resource} label={label} />,
        value: <RecordContextProvider value={record}>{child as any}</RecordContextProvider>,
      };
    })?.filter((item): item is Exclude<typeof item, null> => item !== null) || [];

  return <CloudscapeKeyValuePairs {...props} items={items} columns={columns} minColumnWidth={minColumnWidth} />;
};

KeyValuePairs.Field = KeyValueField;

export default KeyValuePairs;
