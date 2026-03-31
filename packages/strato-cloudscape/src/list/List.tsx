import React from 'react';
import { ListBase, type RaRecord, type ListBaseProps, useTranslate } from '@strato-admin/ra-core';
import { ResourceSchemaProvider, useResourceSchema, useConstructedPageTitle, useSettings } from '@strato-admin/core';
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
  const { label, listTitle, listDescription, listComponent: ListComponent = Table } = useResourceSchema();
  const translate = useTranslate();
  const constructedTitle = useConstructedPageTitle('list', label);

  const finalTitle = React.useMemo(() => {
    if (typeof title === 'function') return title();
    if (React.isValidElement(title)) return title;
    if (title) return translate(title as string);
    if (React.isValidElement(listTitle)) return listTitle;
    if (listTitle) return translate(listTitle as string);
    return constructedTitle;
  }, [title, listTitle, translate, constructedTitle]);

  const finalDescription = React.useMemo(() => {
    if (typeof description === 'function') return description();
    if (React.isValidElement(description)) return description;
    if (description) return translate(description as string);
    if (React.isValidElement(listDescription)) return listDescription;
    if (listDescription) return translate(listDescription as string);
    return undefined;
  }, [description, listDescription, translate]);

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
  const { queryOptions } = useResourceSchema(props.resource);
  const { listPageSize } = useSettings();

  return (
    <ListBase queryOptions={queryOptions} {...props} perPage={props.perPage ?? listPageSize}>
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
