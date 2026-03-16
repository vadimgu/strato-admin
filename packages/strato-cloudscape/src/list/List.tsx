import React from 'react';
import { ListBase, type RaRecord, ResourceSchemaProvider } from 'strato-core';
import Table from './Table';

export interface ListProps<_RecordType extends RaRecord = any> {
  children?: React.ReactNode;
  fieldSchema?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  title?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * Whether to enable text filtering in the implicit Table.
   * @default true
   */
  filtering?: boolean;
  /**
   * Whether to show the preferences button in the implicit Table.
   * @default true
   */
  preferences?: boolean | React.ReactNode;
  [key: string]: any;
}

/**
 * A List component that provides a list context and a Cloudscape Table.
 *
 * @example
 * <List>
 *   <Table>
 *     <Table.Column source="name" />
 *   </Table>
 * </List>
 * 
 * @example
 * // Using FieldSchema from context
 * <List include={['name', 'price']} />
 * 
 * @example
 * // Passing a custom field schema
 * <List fieldSchema={<FieldSchema>...</FieldSchema>}>
 *   <Table />
 * </List>
 */
export const List = <RecordType extends RaRecord = any>({
  children,
  fieldSchema,
  include,
  exclude,
  title,
  actions,
  filtering = true,
  preferences = true,
  ...props
}: ListProps<RecordType>) => {
  const finalChildren = children || (
    <Table 
      include={include} 
      exclude={exclude} 
      title={title} 
      actions={actions} 
      filtering={filtering} 
      preferences={preferences} 
    />
  );

  return (
    <ListBase {...props}>
      <ResourceSchemaProvider resource={props.resource} fieldSchema={fieldSchema}>
        {finalChildren as any}
      </ResourceSchemaProvider>
    </ListBase>
  );
};

export default List;
