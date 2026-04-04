import React from 'react';
import { vi } from 'vitest';
import { useResourceContext } from './ra-core';

export const useFieldSchema = vi.fn(() => []);
export const useInputSchema = vi.fn(() => []);
export const ResourceSchemaProvider = vi.fn(({ children }: any) => children);

export const useResourceSchema = vi.fn((resourceProp?: string) => {
  const resource = resourceProp || useResourceContext();
  const label = resource ? resource.charAt(0).toUpperCase() + resource.slice(1) : '';
  return {
    resource,
    fieldSchema: [],
    inputSchema: [],
    definition: {
      name: resource,
      options: { label },
    },
    label,
    getField: vi.fn(),
    getInput: vi.fn(),
  };
});

export const useSchemaRegistry = vi.fn(() => ({
  defaultComponents: {},
  registerSchemas: vi.fn(),
  getSchemas: vi.fn(),
}));

export const useSettings = vi.fn(() => ({}));

export const useSettingValue = vi.fn(() => (propValue: any, _settingKey: any, schemaValue?: any) => {
  if (propValue !== undefined) return propValue;
  if (schemaValue !== undefined) return schemaValue;
  return undefined;
});

export const useConstructedPageTitle = vi.fn((type, label) => `${type} ${label}`);

export const useListMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  component: undefined,
  perPage: undefined,
  pageSizes: undefined,
  pageSizeLabel: undefined,
}));

export const useCreateMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  successMessage: undefined,
  redirect: undefined,
}));

export const useEditMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  successMessage: undefined,
  redirect: undefined,
  mutationMode: undefined,
}));

export const useDetailMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  component: undefined,
}));

export const useBulkDeleteMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  successMessage: undefined,
  mutationMode: undefined,
}));

export const useDeleteMeta = vi.fn((props?: any) => ({
  title: props?.title,
  description: props?.description,
  successMessage: undefined,
  mutationMode: undefined,
}));

export const useCreatePath = vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`);

export const SchemaRegistryProvider = vi.fn(({ children }: any) => <>{children}</>);

export const Resource = vi.fn(({ children }: any) => <>{children}</>);
