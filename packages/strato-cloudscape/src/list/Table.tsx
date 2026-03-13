import React from 'react';
import CloudscapeTable, { TableProps as CloudscapeTableProps } from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import { RecordContextProvider, RaRecord, useResourceContext, useTranslate } from 'ra-core';
import { useCollection } from '../collection-hooks';
import TextField from '../field/TextField';
import NumberField, { type NumberFieldProps } from '../field/NumberField';
import DateField, { type DateFieldProps } from '../field/DateField';
import BooleanField, { type BooleanFieldProps } from '../field/BooleanField';
import ReferenceField, { type ReferenceFieldProps } from '../field/ReferenceField';
import { type RecordLinkType } from '../RecordLink';
import { FieldContext } from '../field/FieldContext';
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
  const content = children ? (
    <>{children}</>
  ) : FieldComponent ? (
    <FieldComponent link={link} />
  ) : (
    <TextField link={link} />
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};

export interface NumberColumnProps extends ColumnProps {
  source?: string;
}

export const NumberColumn = ({ children, source, link, field: FieldComponent }: NumberColumnProps) => {
  const content = (
    <Box textAlign="right">
      {children ? (
        <>{children}</>
      ) : FieldComponent ? (
        <FieldComponent link={link} />
      ) : (
        <NumberField link={link} />
      )}
    </Box>
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};
(NumberColumn as any).isNumberColumn = true;

export interface DateColumnProps extends ColumnProps {
  source?: string;
}

export const DateColumn = ({ children, source, link, field: FieldComponent }: DateColumnProps) => {
  const content = children ? (
    <>{children}</>
  ) : FieldComponent ? (
    <FieldComponent link={link} />
  ) : (
    <DateField link={link} />
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};

export interface BooleanColumnProps extends ColumnProps {
  source?: string;
}

export const BooleanColumn = ({ children, source, field: FieldComponent }: BooleanColumnProps) => {
  const content = children ? (
    <>{children}</>
  ) : FieldComponent ? (
    <FieldComponent />
  ) : (
    <BooleanField />
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};

export interface ReferenceColumnProps extends ColumnProps {
  source?: string;
  reference: string;
}

export const ReferenceColumn = ({ children, source, reference, link, field: FieldComponent }: ReferenceColumnProps) => {
  // ReferenceCol requires reference, so we pass it down
  const content = FieldComponent ? (
    <FieldComponent reference={reference} link={link}>{children}</FieldComponent>
  ) : (
    <ReferenceField reference={reference} link={link}>{children}</ReferenceField>
  );
  return (
    <FieldContext.Provider value={{ source }}>
      {content}
    </FieldContext.Provider>
  );
};

/**
 * Properties for the Table component.
 */
export interface TableProps<RecordType extends RaRecord = any> extends Partial<
  Omit<CloudscapeTableProps<RecordType>, 'items' | 'columnDefinitions' | 'preferences'>
> {
  /**
   * The header content of the table. Can be a string or a React node.
   */
  header?: React.ReactNode;
  /**
   * Actions to display in the table header, typically a button group.
   */
  actions?: React.ReactNode;
  /**
   * The columns to display, usually using `Table.Column` and its variants.
   */
  children: React.ReactNode;
  /**
   * Whether to enable text filtering.
   * @default false
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
   * @default false
   */
  preferences?: boolean | React.ReactNode;
  /**
   * Whether columns can be reordered by the user.
   * @default true
   */
  reorderable?: boolean;
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
 * <Table header="Products">
 *   <Table.Column source="name" label="Name" />
 *   <Table.NumberColumn source="price" label="Price" />
 * </Table>
 * ```
 */
export const Table = <RecordType extends RaRecord = any>({
  header,
  actions,
  children,
  filtering,
  filteringPlaceholder,
  pageSizeOptions = defaultPageSizeOptions,
  preferences,
  reorderable = true,
  ...props
}: TableProps<RecordType>) => {
  const resource = useResourceContext();
  const translate = useTranslate();

  // 1. Extract columns and options before calling useCollection
  const extractedColumns = React.useMemo(() => {
    const columns: any[] = [];
    const options: { id: string; label: string; alwaysVisible?: boolean }[] = [];

    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const { source, label, header: childHeader, sortable, link, field, children: childChildren, ...restColumnProps } = child.props as any;
      const isNumberColumn = (child.type as any)?.isNumberColumn;

      const headerLabel =
        childHeader ||
        label ||
        (source && resource ? translate(`resources.${resource}.fields.${source}`, { _: source }) : source);
      const finalHeader = isNumberColumn ? <Box textAlign="right">{headerLabel}</Box> : headerLabel;

      const columnId = source || `col-${index}`;
      const id = resource ? `${resource}___${columnId}` : columnId;

      columns.push({
        ...restColumnProps,
        id,
        header: finalHeader,
        cell: (item: RecordType) => (
          <RecordContextProvider value={item}>{child as React.ReactElement}</RecordContextProvider>
        ),
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
  }, [children, resource, translate]);

  const { items, paginationProps, collectionProps, filterProps, preferencesProps } = useCollection<RecordType>({
    filtering: {},
    pagination: {},
    sorting: {},
    preferences: {
      pageSizeOptions,
      visibleContentOptions: !reorderable && extractedColumns.options.length > 0 ? extractedColumns.options : undefined,
      contentDisplayOptions: reorderable && extractedColumns.options.length > 0 ? extractedColumns.options : undefined,
    },
  });

  // 2. Filter columnDefinitions if reordering is disabled (Cloudscape Table handles it if columnDisplay is passed)
  const columnDefinitions = React.useMemo(() => {
    if (reorderable || !preferencesProps.preferences.visibleContent) {
      return extractedColumns.columns;
    }
    return extractedColumns.columns.filter((col) => preferencesProps.preferences.visibleContent?.includes(col.id));
  }, [extractedColumns.columns, preferencesProps.preferences.visibleContent, reorderable]);

  const tableHeader = React.useMemo(() => {
    if (header === null || header === false) {
      return undefined;
    }
    if (React.isValidElement(header)) {
      return header;
    }
    return <TableHeader title={header} actions={actions} />;
  }, [header, actions]);

  return (
    <CloudscapeTable
      {...collectionProps}
      {...props}
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
            filteringPlaceholder={filteringPlaceholder || 'Search...'}
            countText={items?.length ? `${items.length} items` : '0 items'}
          />
        )
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={
        preferences === true || pageSizeOptions ? (
          <CollectionPreferences
            {...preferencesProps}
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            pageSizePreference={
              pageSizeOptions
                ? {
                    title: 'Page size',
                    options: pageSizeOptions,
                  }
                : undefined
            }
            wrapLinesPreference={{
              label: 'Wrap lines',
              description: 'Select to wrap lines and see all text.',
            }}
            stripedRowsPreference={{
              label: 'Striped rows',
              description: 'Select to add alternating shaded rows.',
            }}
            visibleContentPreference={
              !reorderable && extractedColumns.options.length > 0
                ? {
                    title: 'Select visible content',
                    options: [
                      {
                        label: 'Main columns',
                        options: extractedColumns.options,
                      },
                    ],
                  }
                : undefined
            }
            contentDisplayPreference={
              reorderable && extractedColumns.options.length > 0
                ? {
                    title: 'Column preferences',
                    description: 'Customize the visibility and order of columns.',
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
