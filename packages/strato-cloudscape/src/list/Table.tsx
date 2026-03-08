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
import { type FieldLinkType } from '../field/FieldLink';
import { ListHeader } from './ListHeader';

export interface ColProps {
  source?: string;
  label?: string | React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  sortable?: boolean;
  link?: FieldLinkType;
}

export const Col = ({ children, source, link }: ColProps) => {
  if (children) {
    return <>{children}</>;
  }
  if (source) {
    return <TextField source={source} link={link} />;
  }
  return null;
};

export interface NumberColProps extends ColProps, Omit<NumberFieldProps, 'source'> {
  source?: string;
}

export const NumberCol = ({ children, source, link, ...props }: NumberColProps) => {
  if (children) {
    return (
      <Box textAlign="right" {...props}>
        {children}
      </Box>
    );
  }
  if (source) {
    return <NumberField source={source} textAlign="right" link={link} {...props} />;
  }
  return null;
};
(NumberCol as any).isNumberCol = true;

export interface DateColProps extends ColProps, Omit<DateFieldProps, 'source'> {
  source?: string;
}

export const DateCol = ({ children, source, link, ...props }: DateColProps) => {
  if (children) {
    return <>{children}</>;
  }
  if (source) {
    return <DateField source={source} link={link} {...props} />;
  }
  return null;
};

export interface BooleanColProps extends ColProps, Omit<BooleanFieldProps, 'source'> {
  source?: string;
}

export const BooleanCol = ({ children, source, ...props }: BooleanColProps) => {
  if (children) {
    return <>{children}</>;
  }
  if (source) {
    return <BooleanField source={source} {...props} />;
  }
  return null;
};

export interface ReferenceColProps extends ColProps, Omit<ReferenceFieldProps, 'source'> {
  source?: string;
  reference: string;
}

export const ReferenceCol = ({ children, source, reference, link, ...props }: ReferenceColProps) => {
  if (source) {
    return (
      <ReferenceField source={source} reference={reference} link={link} {...props}>
        {children}
      </ReferenceField>
    );
  }
  return null;
};

export interface DataTableProps<RecordType extends RaRecord = any> extends Partial<
  Omit<CloudscapeTableProps<RecordType>, 'items' | 'columnDefinitions' | 'preferences'>
> {
  header?: React.ReactNode;
  children: React.ReactNode;
  filtering?: boolean;
  filteringPlaceholder?: string;
  pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
  preferences?: boolean | React.ReactNode;
  reorderable?: boolean;
}

export const DataTable = <RecordType extends RaRecord = any>({
  header,
  children,
  filtering,
  filteringPlaceholder,
  pageSizeOptions,
  preferences,
  reorderable = true,
  ...props
}: DataTableProps<RecordType>) => {
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

      const { source, label, header: childHeader, sortable } = child.props as any;
      const isNumberCol = (child.type as any)?.isNumberCol;

      const headerLabel =
        childHeader ||
        label ||
        (source && resource ? translate(`resources.${resource}.fields.${source}`, { _: source }) : source);
      const finalHeader = isNumberCol ? <Box textAlign="right">{headerLabel}</Box> : headerLabel;

      const columnId = source || `col-${index}`;
      const id = resource ? `${resource}___${columnId}` : columnId;

      columns.push({
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

  return (
    <CloudscapeTable
      {...collectionProps}
      {...props}
      stripedRows={preferencesProps.preferences.stripedRows}
      wrapLines={preferencesProps.preferences.wrapLines}
      columnDefinitions={columnDefinitions}
      columnDisplay={reorderable ? preferencesProps.preferences.contentDisplay : undefined}
      items={items || []}
      header={header ? React.isValidElement(header) ? header : <ListHeader title={header} /> : <ListHeader />}
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

DataTable.Col = Col;
DataTable.NumberCol = NumberCol;
DataTable.DateCol = DateCol;
DataTable.BooleanCol = BooleanCol;
DataTable.ReferenceCol = ReferenceCol;

export const Table = DataTable;

export default DataTable;
