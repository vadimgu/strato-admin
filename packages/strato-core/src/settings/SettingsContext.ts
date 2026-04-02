import { createContext, useContext } from 'react';
import type { ComponentType, ReactNode } from 'react';

export interface AdminSettings {
  listComponent?: ComponentType<any>;
  detailComponent?: ComponentType<any>;
  deleteSuccessMessage?: string | ReactNode;
  bulkDeleteSuccessMessage?: string | ReactNode | ((count: number) => ReactNode);
  listPageSize?: number;
  listPageSizes?: number[];
  listPageSizeLabel?: (pageSize: number) => ReactNode;
  editSuccessMessage?: string | ReactNode;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
  createRedirect?: 'list' | 'detail' | 'edit' | false;
  editRedirect?: 'list' | 'detail' | false;
}

export const SettingsContext = createContext<AdminSettings>({});

export const useSettings = (): AdminSettings => useContext(SettingsContext);
