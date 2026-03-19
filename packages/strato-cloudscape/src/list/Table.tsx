import React from 'react';
import CloudscapeTable, { TableProps as CloudscapeTableProps } from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import { RecordContextProvider, RaRecord, useResourceSchema, useTranslateLabel, useTranslate } from '@strato-admin/core';
import { useCollection } from '../collection-hooks';
import TextField from '../field/TextField';
import NumberField from '../field/NumberField';
import DateField from '../field/DateField';
import BooleanField from '../field/BooleanField';
import ReferenceField from '../field/ReferenceField';
import { type RecordLinkType } from '../RecordLink';
import { TableHeader } from './TableHeader';

export type CloudscapeColumnDefinitionProps = Partial<
  Omit<CloudscapeTableProps.ColumnDefinition<any>, 'id' | 'header' | 'cell' | 'sortingField'>
>;

export interface ColumnProps extends CloudscapeColumnDefinitionProps {
  source?: string;
  label?: string | React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  sortable?: boolean;
  link?: RecordLinkType;
  field?: React.ComponentType<any>;
}

export const Column = ({ children, source, link, field: FieldComponent }: ColumnProps) => {
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
    return <FieldComponent link={link} source={source} />;
  }
  return <TextField link={link} source={source} />;
};

export interface NumberColumnProps extends ColumnProps {
  source?: string;
}

export const NumberColumn = ({ children, source, link, field: FieldComponent }: NumberColumnProps) => {
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
    return <FieldComponent link={link} source={source} />;
  }
  return <NumberField link={link} source={source} />;
};
(NumberColumn as any).isNumberColumn = true;

export interface DateColumnProps extends ColumnProps {
  source?: string;
}

export const DateColumn = ({ children, source, link, field: FieldComponent }: DateColumnProps) => {
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
    return <FieldComponent link={link} source={source} />;
  }
  return <DateField link={link} source={source} />;
};

export interface BooleanColumnProps extends ColumnProps {
  source?: string;
}

export const BooleanColumn = ({ children, source, field: FieldComponent }: BooleanColumnProps) => {
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
  return <BooleanField source={source} />;
};

export interface ReferenceColumnProps extends ColumnProps {
  source?: string;
  reference: string;
}

export const ReferenceColumn = ({ children, source, reference, link, field: FieldComponent }: ReferenceColumnProps) => {
  // ReferenceCol requires reference, so we pass it down
  if (FieldComponent) {
    return (
      <FieldComponent reference={reference} link={link} source={source}>
        {children}
      </FieldComponent>
    );
  }
  return (
    <ReferenceField reference={reference} link={link} source={source}>
      {children}
    </ReferenceField>
  );
};

/**
 * Properties for the Table component.
 */
export interface TableProps<RecordType extends RaRecord = any> extends Partial<
  Omit<CloudscapeTableProps<RecordType>, 'items' | 'columnDefinitions' | 'preferences'>
> {
  /**
   * The title content of the table. Can be a string or a React node.
   */
  title?: React.ReactNode;
  /**
   * Actions to display in the table header, typically a button group.
   */
  actions?: React.ReactNode;
  /**
   * The columns to display, usually using `Table.Column` and its variants.
   */
  children?: React.ReactNode;
  /**
   * Include only these fields from the schema.
   */
  include?: string[];
  /**
   * Exclude these fields from the schema.
   */
  exclude?: string[];
  /**
   * Whether to enable text filtering.
   * @default true
   */
  filtering?: boolean;
  /**
   * Placeholder text for the filter input.
   * @default "Search..."
   */
  filteringPlaceholder?: string;
  /**
   * Options for the page size selector.
   */
  pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
  /**
   * Whether to show the preferences button or custom preferences content.
   * @default true
   */
  preferences?: boolean | React.ReactNode;
  /**
   * Whether columns can be reordered by the user.
   * @default true
   */
  reorderable?: boolean;
  /**
   * The fields to display by default.
   * Can be an array of field sources/IDs.
   * If not specified, the first 5 fields will be shown.
   */
  defaultVisibleFields?: string[];
}

const defaultPageSizeOptions = [
  { value: 10, label: '10 items' },
  { value: 25, label: '25 items' },
  { value: 50, label: '50 items' },
  { value: 100, label: '100 items' },
];

/**
 * The Table component provides a declarative way to build data tables with Cloudscape components
 * while integrating with React Admin's data fetching and state management.
 *
 * @example
 * ```tsx
 * <Table title="Products">
 *   <Table.Column source="name" label="Name" />
 *   <Table.NumberColumn source="price" label="Price" />
 * </Table>
 * ```
 */
export const Table = <RecordType extends RaRecord = any>({
  title,
  actions,
  children,
  include,
  exclude,
  filtering = true,
  filteringPlaceholder,
  pageSizeOptions = defaultPageSizeOptions,
  preferences = true,
  reorderable = true,
  defaultVisibleFields,
  selectionType,
  ...props
}: TableProps<RecordType>) => {
  const translate = useTranslate();
  const translateLabel = useTranslateLabel();
  const { resource, fieldSchema: schemaChildren, definition, label: schemaLabel } = useResourceSchema();

  const finalSelectionType = selectionType ?? (definition?.options?.canDelete ? 'multi' : undefined);

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

  // 1. Extract columns and options before calling useCollection
  const extractedColumns = React.useMemo(() => {
    const columns: any[] = [];
    const options: { id: string; label: string; alwaysVisible?: boolean }[] = [];

    finalChildren.forEach((child, index) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const {
        source,
        label,
        header: childHeader,
        sortable,
        link,
        field,
        children: childChildren,
        ...restColumnProps
      } = child.props as any;

      const isNumberColumn = (child.type as any)?.isNumberColumn;

      const headerLabel = translateLabel({ label, resource, source });
      const finalHeader = isNumberColumn ? <Box textAlign="right">{headerLabel}</Box> : headerLabel;

      const columnId = source || `col-${index}`;
      const id = resource ? `${resource}___${columnId}` : columnId;

      columns.push({
        ...restColumnProps,
        id,
        header: finalHeader,
        cell: (item: RecordType) => {
          const content = <RecordContextProvider value={item}>{child as any}</RecordContextProvider>;
          return isNumberColumn ? <Box textAlign="right">{content}</Box> : content;
        },
        sortingField: sortable !== false ? source : undefined,
      });

      // If we have a meaningful label/header string, allow toggling
      if (typeof headerLabel === 'string') {
        options.push({
          id,
          label: headerLabel,
        });
      }
    });

    return { columns, options };
  }, [finalChildren, resource, translateLabel]);

  const defaultVisibleContent = React.useMemo(() => {
    if (extractedColumns.options.length === 0) return undefined;

    if (defaultVisibleFields) {
      // Map user-provided fields to their actual IDs
      return extractedColumns.options
        .filter((opt) => {
          const column = extractedColumns.columns.find((c) => c.id === opt.id);
          return (
            defaultVisibleFields.includes(opt.id) ||
            (column?.sortingField && defaultVisibleFields.includes(column.sortingField))
          );
        })
        .map((opt) => opt.id);
    }

    // Default to first 5 toggleable columns
    return extractedColumns.options.slice(0, 5).map((opt) => opt.id);
  }, [extractedColumns, defaultVisibleFields]);

  const defaultContentDisplay = React.useMemo(() => {
    if (extractedColumns.options.length === 0) return undefined;

    const visibleIds = defaultVisibleContent || [];

    return extractedColumns.options.map((opt) => ({
      id: opt.id,
      visible: visibleIds.includes(opt.id),
    }));
  }, [extractedColumns.options, defaultVisibleContent]);

  const { items, paginationProps, collectionProps, filterProps, preferencesProps } = useCollection<RecordType>({
    filtering: {},
    pagination: {},
    sorting: {},
    preferences: {
      pageSizeOptions,
      visibleContentOptions:
        !reorderable && extractedColumns.options.length > 0 ? extractedColumns.options : undefined,
      contentDisplayOptions:
        reorderable && extractedColumns.options.length > 0 ? extractedColumns.options : undefined,
      visibleContent: defaultVisibleContent,
      contentDisplay: defaultContentDisplay,
    },
  });

  // 2. Filter columnDefinitions if reordering is disabled (Cloudscape Table handles it if columnDisplay is passed)
  const columnDefinitions = React.useMemo(() => {
    if (reorderable || !preferencesProps.preferences.visibleContent) {
      return extractedColumns.columns;
    }
    return extractedColumns.columns.filter((col) => {
      // Always show columns that are not in options (non-toggleable columns like Actions)
      const isToggleable = extractedColumns.options.some((opt) => opt.id === col.id);
      if (!isToggleable) return true;

      return preferencesProps.preferences.visibleContent?.includes(col.id);
    });
  }, [extractedColumns.columns, extractedColumns.options, preferencesProps.preferences.visibleContent, reorderable]);

  const tableHeader = React.useMemo(() => {
    if (title === null || title === false) {
      return undefined;
    }
    if (React.isValidElement(title)) {
      return title;
    }
    const finalTitle = title !== undefined ? title : schemaLabel;
    return <TableHeader title={finalTitle} actions={actions} />;
  }, [title, actions, schemaLabel]);

  return (
    <CloudscapeTable
      {...collectionProps}
      {...props}
      selectionType={finalSelectionType}
      stripedRows={preferencesProps.preferences.stripedRows}
      wrapLines={preferencesProps.preferences.wrapLines}
      columnDefinitions={columnDefinitions}
      columnDisplay={reorderable ? preferencesProps.preferences.contentDisplay : undefined}
      items={items || []}
      header={tableHeader}
      filter={
        filtering && (
          <TextFilter
            {...filterProps}
          />
        )
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        preferences === true || pageSizeOptions ? (
          <CollectionPreferences
            {...preferencesProps}
            pageSizePreference={
              pageSizeOptions
                ? {
                  options: pageSizeOptions,
                }
                : undefined
            }
            visibleContentPreference={
              !reorderable && extractedColumns.options.length > 0
                ? {
                  title: translate('ra.action.select_columns', { _: 'Select visible columns' }),
                  options: [
                    {
                      label: translate('ra.action.select_columns', { _: 'Select visible columns' }),
                      options: extractedColumns.options,
                    },
                  ],
                }
                : undefined
            }
            contentDisplayPreference={
              reorderable && extractedColumns.options.length > 0
                ? {
                  title: translate('ra.action.select_columns', { _: 'Select visible columns' }),
                  options: extractedColumns.options,
                }
                : undefined
            }
          />
        ) : React.isValidElement(preferences) ? (
          preferences
        ) : undefined
      }
    />
  );
};

Table.Column = Column;
Table.NumberColumn = NumberColumn;
Table.DateColumn = DateColumn;
Table.BooleanColumn = BooleanColumn;
Table.ReferenceColumn = ReferenceColumn;
Table.Header = TableHeader;

export default Table;
