import React, { ReactNode, useState, useEffect } from 'react';
import { CoreAdmin, type CoreAdminProps, SchemaRegistryProvider, localStorageStore, useLocaleState } from 'strato-core';
import { icuI18nProvider } from 'strato-i18n';
import englishMessages from 'strato-language-en';
import AppLayout from './layout/AppLayout';

import { I18nProvider, importMessages, I18nProviderProps } from "@cloudscape-design/components/i18n";

export interface AdminProps extends CoreAdminProps {
  children?: ReactNode;
  title?: string;
}

const defaultI18nProvider = icuI18nProvider(() => englishMessages);
const defaultStore = localStorageStore();

/**
 * Syncs Cloudscape I18n with React-Admin locale.
 */
const CloudscapeI18n = ({ children }: { children: ReactNode }) => {
  const [locale] = useLocaleState();
  const [messages, setMessages] = useState<I18nProviderProps.Messages | null>(null);

  useEffect(() => {
    let active = true;
    importMessages(locale).then((msgs) => {
      if (active) {
        setMessages(msgs);
      }
    });
    return () => {
      active = false;
    };
  }, [locale]);

  if (!messages) {
    return null;
  }

  return (
    <I18nProvider locale={locale} messages={messages}>
      {children}
    </I18nProvider>
  );
};

const CloudscapeLayout = (props: any) => {
  const { children, layout: Layout = AppLayout, ...rest } = props;
  return (
    <CloudscapeI18n>
      <Layout {...rest}>{children}</Layout>
    </CloudscapeI18n>
  );
};

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
        layout={(layoutProps: any) => <CloudscapeLayout {...layoutProps} layout={Layout} />}
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
