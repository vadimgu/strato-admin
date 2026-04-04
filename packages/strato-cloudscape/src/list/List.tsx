import React from 'react';
import { ListBase, type RaRecord, type ListBaseProps } from '@strato-admin/ra-core';
import { ResourceSchemaProvider, useResourceSchema, useListMeta, useSettings } from '@strato-admin/core';
import Table from './Table';

export interface ListProps<RecordType extends RaRecord = any> extends ListBaseProps<RecordType> {
  children?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  title?: React.ReactNode | (() => React.ReactNode);
  description?: React.ReactNode | (() => React.ReactNode);
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
  /**
   * The fields to display by default.
   */
  display?: string[];
}

const ListUI = ({
  children,
  title,
  actions,
  description,
  include,
  exclude,
  filtering,
  preferences,
  display,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode | (() => React.ReactNode);
  actions?: React.ReactNode;
  description?: React.ReactNode | (() => React.ReactNode);
  include?: string[];
  exclude?: string[];
  filtering?: boolean;
  preferences?: boolean | React.ReactNode;
  display?: string[];
}) => {
  const {
    title: finalTitle,
    description: finalDescription,
    component: ListComponent = Table,
  } = useListMeta({ title, description });

  const finalChildren = children || (
    <ListComponent
      include={include}
      exclude={exclude}
      display={display}
      title={finalTitle}
      description={finalDescription}
      actions={actions}
      filtering={filtering}
      preferences={preferences}
    />
  );

  return <>{finalChildren}</>;
};

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
 */
export const List = <RecordType extends RaRecord = any>({
  children,
  include,
  exclude,
  title,
  actions,
  description,
  filtering = true,
  preferences = true,
  display,
  ...props
}: ListProps<RecordType>) => {
  const { queryOptions, perPage: schemaPerPage } = useResourceSchema(props.resource);
  const { listPageSize } = useSettings();

  return (
    <ListBase queryOptions={queryOptions} {...props} perPage={props.perPage ?? schemaPerPage ?? listPageSize}>
      <ResourceSchemaProvider resource={props.resource}>
        <ListUI
          title={title}
          actions={actions}
          description={description}
          include={include}
          exclude={exclude}
          filtering={filtering}
          preferences={preferences}
          display={display}
        >
          {children}
        </ListUI>
      </ResourceSchemaProvider>
    </ListBase>
  );
};

export default List;
