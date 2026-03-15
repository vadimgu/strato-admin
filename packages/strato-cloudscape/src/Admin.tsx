import React, { ReactNode } from 'react';
import { CoreAdmin, type CoreAdminProps, SchemaRegistryProvider, localStorageStore } from 'strato-core';
import { icuI18nProvider } from 'strato-i18n-icu';
import englishMessages from 'strato-language-en';
import AppLayout from './layout/AppLayout';

export interface AdminProps extends CoreAdminProps {
  children?: ReactNode;
  title?: string;
}

const defaultI18nProvider = icuI18nProvider(() => englishMessages);
const defaultStore = localStorageStore();

/**
 * The root component of a Strato Admin application.
 *
 * It sets up the data fetching context, authentication, and layout using Cloudscape.
 *
 * @example
 * <Admin dataProvider={myDataProvider} title="My App">
 *   <Resource name="posts" list={PostList} />
 * </Admin>
 */
export const Admin = ({
  children,
  title,
  layout: Layout = AppLayout,
  i18nProvider = defaultI18nProvider,
  store = defaultStore,
  ...props
}: AdminProps) => {
  return (
    <SchemaRegistryProvider>
      <CoreAdmin
        {...props}
        layout={Layout}
        title={title}
        i18nProvider={i18nProvider}
        store={store}
      >
        {children}
      </CoreAdmin>
    </SchemaRegistryProvider>
  );
};

export default Admin;
