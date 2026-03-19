import React from 'react';
import {
  ListBase,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
  type ListBaseProps,
  useTranslate,
} from '@strato-admin/core';
import Table from './Table';

export interface ListProps<RecordType extends RaRecord = any> extends ListBaseProps<RecordType> {
  children?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  title?: React.ReactNode;
  description?: React.ReactNode;
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
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  description?: React.ReactNode;
  include?: string[];
  exclude?: string[];
  filtering?: boolean;
  preferences?: boolean | React.ReactNode;
}) => {
  const { label, labelList, descriptionList } = useResourceSchema();
  const translate = useTranslate();

  // Resolve title: Prop > Schema labelList > Schema Label > Fallback
  const finalTitle =
    (typeof title === 'string' ? translate(title, { _: title }) : title) ??
    (typeof labelList === 'string' ? translate(labelList, { _: labelList }) : labelList) ??
    (label ? translate('ra.page.list', { name: label, _: label }) : translate('ra.page.list', { _: 'List' }));

  const finalDescription =
    (typeof description === 'string' ? translate(description, { _: description }) : description) ??
    (typeof descriptionList === 'string' ? translate(descriptionList, { _: descriptionList }) : descriptionList);

  const finalChildren = children || (
    <Table
      include={include}
      exclude={exclude}
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
  ...props
}: ListProps<RecordType>) => {
  return (
    <ListBase {...props}>
      <ResourceSchemaProvider resource={props.resource}>
        <ListUI
          title={title}
          actions={actions}
          description={description}
          include={include}
          exclude={exclude}
          filtering={filtering}
          preferences={preferences}
        >
          {children}
        </ListUI>
      </ResourceSchemaProvider>
    </ListBase>
  );
};

export default List;
