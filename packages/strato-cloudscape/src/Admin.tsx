import React, { ReactNode, useState, useEffect } from 'react';
import {
  CoreAdmin,
  type CoreAdminProps,
  type AdminChildren,
  SchemaRegistryProvider,
  localStorageStore,
  useLocaleState,
  registerDefaultResourceComponents,
  registerFieldInputMapping,
} from 'strato-core';
import { icuI18nProvider } from 'strato-i18n';
import englishMessages from 'strato-language-en';
import AppLayout from './layout/AppLayout';
import { List } from './list';
import { Create } from './create';
import { Edit } from './edit';
import { Show } from './detail';

import { TextField, NumberField, CurrencyField, ReferenceField } from './field';
import { TextInput, NumberInput, ReferenceInput } from './input';

import { I18nProvider, importMessages, I18nProviderProps } from '@cloudscape-design/components/i18n';

// Register Cloudscape themed components as defaults for ResourceSchema.
// This is done once, here, to avoid circular dependencies at the module level.
registerDefaultResourceComponents({
  list: List,
  create: Create,
  edit: Edit,
  show: Show,
});

registerFieldInputMapping(
  new Map<any, any>([
    [TextField, TextInput],
    [NumberField, NumberInput],
    [CurrencyField, NumberInput],
    [ReferenceField, ReferenceInput],
  ])
);

export interface AdminProps extends CoreAdminProps {
  children?: AdminChildren;
  title?: string;
}

const defaultI18nProvider = icuI18nProvider(() => englishMessages as any);
const defaultStore = localStorageStore();

/**
 * Syncs Cloudscape I18n with React-Admin locale.
 */
const CloudscapeI18n = ({ children }: { children: ReactNode }) => {
  const [locale] = useLocaleState();
  const [messages, setMessages] = useState<ReadonlyArray<I18nProviderProps.Messages>>([]);

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

  if (messages.length === 0) {
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
