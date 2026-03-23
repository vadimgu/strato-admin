import React, { ReactNode } from 'react';
import {
  ReferenceManyFieldBase,
  type RaRecord,
  ResourceSchemaProvider,
  useResourceSchema,
} from '@strato-admin/core';
import { type FieldProps } from './types';
import Table from '../list/Table';

export interface ReferenceManyFieldProps<RecordType extends RaRecord = RaRecord> extends FieldProps<RecordType> {
  children?: ReactNode;
  reference: string;
  target: string;
  filter?: any;
  sort?: { field: string; order: 'ASC' | 'DESC' };
  perPage?: number;
  page?: number;
  fieldSchema?: ReactNode;
  /**
   * Element to display during loading.
   */
  loading?: ReactNode;
  /**
   * Element to display if there's no data.
   */
  empty?: ReactNode;
  /**
   * Element to display if there's an error.
   */
  error?: ReactNode;
  /**
   * Element to display if the application is offline.
   */
  offline?: ReactNode;
  /**
   * Debounce time for filtering.
   */
  debounce?: number;
  /**
   * Whether to synchronize the list with the URL.
   * @default false
   */
  synchronizeWithLocation?: boolean;
  /**
   * Include only these fields from the schema.
   */
  include?: string[];
  /**
   * Exclude these fields from the schema.
   */
  exclude?: string[];
  /**
   * The fields to display by default.
   */
  display?: string[];
  /**
   * Whether to enable text filtering.
   */
  filtering?: boolean;
  /**
   * Whether to show the preferences button or custom preferences content.
   */
  preferences?: boolean | React.ReactNode;
  /**
   * The title of the list.
   */
  title?: React.ReactNode;
}

/**
 * Render related records to the current one.
 *
 * @example
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Table title="Comments">
 *         <Table.Column source="id" />
 *         <Table.Column source="body" />
 *         <Table.Column source="created_at" />
 *     </Table>
 * </ReferenceManyField>
 *
 * @example
 * // Honors the default listComponent from the reviews resource schema
 * <ReferenceManyField reference="reviews" target="product_id" />
 */
export const ReferenceManyField = <RecordType extends RaRecord = RaRecord>(
  props: ReferenceManyFieldProps<RecordType>,
) => {
  const {
    children,
    reference,
    fieldSchema,
    include,
    exclude,
    display,
    filtering,
    preferences,
    title,
    ...rest
  } = props;

  return (
    <ReferenceManyFieldBase reference={reference} {...rest}>
      <ResourceSchemaProvider resource={reference} fieldSchema={fieldSchema}>
        <ReferenceManyFieldUI
          reference={reference}
          include={include}
          exclude={exclude}
          display={display}
          filtering={filtering}
          preferences={preferences}
          title={title}
        >
          {children}
        </ReferenceManyFieldUI>
      </ResourceSchemaProvider>
    </ReferenceManyFieldBase>
  );
};

const ReferenceManyFieldUI = ({
  children,
  reference,
  include,
  exclude,
  display,
  filtering,
  preferences,
  title,
}: {
  children?: ReactNode;
  reference: string;
  include?: string[];
  exclude?: string[];
  display?: string[];
  filtering?: boolean;
  preferences?: boolean | React.ReactNode;
  title?: React.ReactNode;
}) => {
  const { listComponent: ListComponent = Table } = useResourceSchema(reference);

  const finalChildren =
    children || (
      <ListComponent
        include={include}
        exclude={exclude}
        display={display}
        filtering={filtering}
        preferences={preferences}
        title={title}
      />
    );

  return <>{finalChildren}</>;
};

export default ReferenceManyField;
ReferenceManyField.isCollectionField = true;
