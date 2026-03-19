import React from 'react';
import { vi } from 'vitest';

export const useTranslate = vi.fn(() => (key: string, options: any) => options?._ || key);
export const useTranslateLabel = vi.fn(() => (label: any) => (typeof label === 'string' ? label : label?.source || ''));
export const useGetResourceLabel = vi.fn(() => (resource: string) => {
  if (resource === 'products') return 'Products';
  if (resource === 'categories') return 'Categories';
  return resource;
});
export const useResourceDefinitions = vi.fn(() => ({}));
export const useResourceDefinition = vi.fn(() => ({
  name: 'products',
  options: { label: 'Products' },
}));
export const useResourceContext = vi.fn();
export const useRecordContext = vi.fn((record) => record || {});
export const useDefaultTitle = vi.fn(() => '');
export const useInput = vi.fn();
export const useChoicesContext = vi.fn(() => ({ allChoices: [], isPending: false }));
export const useGetRecordRepresentation = vi.fn(() => (record: any) => record?.name || record?.id || record);
export const useFieldSchema = vi.fn(() => []);
export const useInputSchema = vi.fn(() => []);
export const ResourceSchemaProvider = vi.fn(({ children }: any) => children);
export const ValidationError = vi.fn(({ error }: any) => <span>{error}</span>);
export const useStore = vi.fn(() => ['light', vi.fn()]);
export const useSaveContext = vi.fn(() => ({ save: vi.fn(), saving: false }));
export const useNotify = vi.fn(() => vi.fn());
export const useRedirect = vi.fn(() => vi.fn());
export const useRefresh = vi.fn(() => vi.fn());
export const useFieldValue = vi.fn(({ source, record }: any) => record?.[source]);
export const useCreatePath = vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`);
export const useLocale = vi.fn(() => 'en');
export const useBulkDeleteController = vi.fn(() => ({
  handleDelete: vi.fn(),
  isPending: false,
  isLoading: false,
}));

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

export const CreateBase = vi.fn(({ children }: any) => <div data-testid="create-base">{children}</div>);
export const EditBase = vi.fn(({ children }: any) => <div data-testid="edit-base">{children}</div>);
export const ShowBase = vi.fn(({ children }: any) => <div data-testid="show-base">{children}</div>);
export const ListBase = vi.fn(({ children }: any) => <div data-testid="list-base">{children}</div>);

export const useShowContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useEditContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useCreateContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useListContext = vi.fn(() => ({ total: 0, isPending: false, selectedIds: [], defaultTitle: 'Products' }));

export const Form = vi.fn(({ children }: any) => <div data-testid="ra-form">{children}</div>);
export const FieldTitle = vi.fn(({ label, source }: any) => <span data-testid="field-title">{label || source}</span>);
export const RecordContextProvider = vi.fn(({ children }: any) => <>{children}</>);
