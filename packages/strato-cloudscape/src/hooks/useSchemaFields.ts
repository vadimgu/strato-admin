import React from 'react';
import { useResourceSchema } from '@strato-admin/core';

const noCollectionFields = (child: React.ReactElement) => !(child.type as any).isCollectionField;

function filterFields(
  base: React.ReactNode,
  options: {
    include?: string[];
    exclude?: string[];
    defaultFilter?: (child: React.ReactElement) => boolean;
  } = {},
): React.ReactElement[] {
  const { include, exclude, defaultFilter } = options;
  let result = React.Children.toArray(base) as React.ReactElement[];

  if (include) {
    return result.filter((child) => React.isValidElement(child) && include.includes((child.props as any).source));
  }
  if (defaultFilter) {
    result = result.filter((child) => React.isValidElement(child) && defaultFilter(child));
  }
  if (exclude) {
    result = result.filter((child) => React.isValidElement(child) && !exclude.includes((child.props as any).source));
  }
  return result;
}

export function useSchemaFields() {
  const {
    fieldSchema,
    inputSchema,
    listInclude,
    listExclude,
    detailInclude,
    detailExclude,
    formInclude,
    formExclude,
    editInclude,
    editExclude,
    createInclude,
    createExclude,
  } = useResourceSchema();

  const getListFields = React.useCallback(
    (children: React.ReactNode, opts: { include?: string[]; exclude?: string[] } = {}) =>
      filterFields(children || fieldSchema, {
        include: opts.include || listInclude,
        exclude: opts.exclude || listExclude,
        defaultFilter: noCollectionFields,
      }),
    [fieldSchema, listInclude, listExclude],
  );

  const getDetailFields = React.useCallback(
    (children: React.ReactNode, opts: { include?: string[]; exclude?: string[] } = {}) => {
      const hasExplicit = React.Children.count(children) > 0;
      const all = filterFields(children || fieldSchema, {
        include: hasExplicit ? undefined : opts.include || detailInclude,
        exclude: hasExplicit ? undefined : opts.exclude || detailExclude,
      });
      return {
        scalarFields: all.filter((c) => !(c.type as any).isCollectionField),
        collectionFields: all.filter((c) => (c.type as any).isCollectionField),
      };
    },
    [fieldSchema, detailInclude, detailExclude],
  );

  const getEditFields = React.useCallback(
    (children: React.ReactNode, opts: { include?: string[]; exclude?: string[] } = {}) =>
      filterFields(children || inputSchema, {
        include: opts.include || editInclude || formInclude,
        exclude: opts.exclude || editExclude || formExclude,
      }),
    [inputSchema, editInclude, editExclude, formInclude, formExclude],
  );

  const getCreateFields = React.useCallback(
    (children: React.ReactNode, opts: { include?: string[]; exclude?: string[] } = {}) =>
      filterFields(children || inputSchema, {
        include: opts.include || createInclude || formInclude,
        exclude: opts.exclude || createExclude || formExclude,
      }),
    [inputSchema, createInclude, createExclude, formInclude, formExclude],
  );

  return { getListFields, getDetailFields, getEditFields, getCreateFields };
}
