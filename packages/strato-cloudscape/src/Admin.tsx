import React, { useMemo } from 'react';
import { CoreAdminContext, CoreAdminUI, AdminRouter, type CoreAdminContextProps } from 'ra-core';
import { icuI18nProvider } from 'strato-i18n-icu';
import englishMessages from 'strato-language-en';
import { AppLayout } from './layout';

const defaultI18nProvider = icuI18nProvider(() => englishMessages as any, 'en');

export interface AdminProps extends CoreAdminContextProps {
  children: React.ReactNode;
  title?: string;
}

export const Admin = ({ children, title, i18nProvider = defaultI18nProvider, ...props }: AdminProps) => {
  const Layout = useMemo(() => (layoutProps: any) => <AppLayout {...layoutProps} title={title} />, [title]);

  return (
    <CoreAdminContext i18nProvider={i18nProvider} {...props}>
      <AdminRouter>
        <CoreAdminUI layout={Layout} title={title}>
          {children}
        </CoreAdminUI>
      </AdminRouter>
    </CoreAdminContext>
  );
};

export default Admin;
