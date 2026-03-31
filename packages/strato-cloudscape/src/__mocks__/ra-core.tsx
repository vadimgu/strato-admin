import React from 'react';
import { vi } from 'vitest';

export const useTranslate = vi.fn(() => (key: string, options: any) => {
  return options?._ || key;
});

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
export const ValidationError = vi.fn(({ error }: any) => <span>{error}</span>);
export const useStore = vi.fn(() => ['light', vi.fn()]);
export const useSaveContext = vi.fn(() => ({ save: vi.fn(), saving: false }));
export const useNotify = vi.fn(() => vi.fn());
export const useNotificationContext = vi.fn(() => ({
  notifications: [],
  setNotifications: vi.fn(),
}));
export const useRedirect = vi.fn(() => vi.fn());
export const useRefresh = vi.fn(() => vi.fn());
export const useFieldValue = vi.fn(({ source, record }: any) => record?.[source]);
export const useLocale = vi.fn(() => 'en');
export const useLocales = vi.fn(() => [{ locale: 'en', name: 'English' }]);
export const useSetLocale = vi.fn(() => vi.fn());
export const useAuthProvider = vi.fn(() => null);
export const useBulkDeleteController = vi.fn(() => ({
  handleDelete: vi.fn(),
  isPending: false,
  isLoading: false,
}));
export const useDeleteController = vi.fn(() => ({
  handleDelete: vi.fn(),
  isPending: false,
  isLoading: false,
}));

export const CreateBase = vi.fn(({ children }: any) => <div data-testid="create-base">{children}</div>);
export const EditBase = vi.fn(({ children }: any) => <div data-testid="edit-base">{children}</div>);
export const ShowBase = vi.fn(({ children }: any) => <div data-testid="show-base">{children}</div>);
export const ListBase = vi.fn(({ children }: any) => <div data-testid="list-base">{children}</div>);

export const useShowContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useEditContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useCreateContext = vi.fn(() => ({ isLoading: false, record: {}, defaultTitle: 'Products' }));
export const useListContext = vi.fn(() => ({ total: 0, isPending: false, selectedIds: [], defaultTitle: 'Products' }));

export const useShowController = vi.fn(() => ({ isLoading: false, record: {}, resource: 'products' }));
export const useEditController = vi.fn(() => ({ isLoading: false, record: {}, resource: 'products' }));
export const useCreateController = vi.fn(() => ({ isLoading: false, record: {}, resource: 'products' }));

export const ShowContextProvider = vi.fn(({ children }: any) => <>{children}</>);
export const EditContextProvider = vi.fn(({ children }: any) => <>{children}</>);
export const CreateContextProvider = vi.fn(({ children }: any) => <>{children}</>);
export const ListContextProvider = vi.fn(({ children }: any) => <>{children}</>);
export const RecordContextProvider = vi.fn(({ children }: any) => <>{children}</>);
export const ResourceContextProvider = vi.fn(({ children }: any) => <>{children}</>);

export const Form = vi.fn(({ children }: any) => <div data-testid="ra-form">{children}</div>);
export const FieldTitle = vi.fn(({ label, source }: any) => <span data-testid="field-title">{label || source}</span>);

export const ReferenceFieldBase = vi.fn(({ children }: any) => <>{children}</>);
export const ReferenceInputBase = vi.fn(({ children }: any) => <>{children}</>);
export const ReferenceManyFieldBase = vi.fn(({ children }: any) => <>{children}</>);

export const useList = vi.fn(() => ({ data: [], total: 0, isPending: false }));
export const TestContext = vi.fn(({ children }: any) => <>{children}</>);
export const CoreAdmin = vi.fn(({ children }: any) => <>{children}</>);
export const localStorageStore = vi.fn(() => ({}));
export const useLocaleState = vi.fn(() => ['en', vi.fn()]);
