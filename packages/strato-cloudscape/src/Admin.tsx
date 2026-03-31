import React, { ReactNode, useState, useEffect } from 'react';
import {
  CoreAdmin,
  type CoreAdminProps,
  type AdminChildren,
  localStorageStore,
  useLocaleState,
} from '@strato-admin/ra-core';
import {
  SchemaRegistryProvider,
  registerDefaultResourceComponents,
  registerFieldInputMapping,
  SettingsContext,
  type AdminSettings,
} from '@strato-admin/core';
import { icuI18nProvider } from '@strato-admin/i18n';
import englishMessages from '@strato-admin/language-en';
import AppLayout from './layout/AppLayout';
import Ready from './layout/Ready';
import { List } from './list';
import { Create } from './create';
import { Edit } from './edit';
import { Detail } from './detail';
import { FRAMEWORK_DEFAULTS } from './defaults';

import { TextField, NumberField, CurrencyField, ReferenceField, ArrayField, BooleanField } from './field';
import { TextInput, NumberInput, ReferenceInput, ArrayInput, BooleanInput } from './input';

import { I18nProvider, importMessages, I18nProviderProps } from '@cloudscape-design/components/i18n';

// Register Cloudscape themed routing components as defaults for ResourceSchema.
// This is done once, here, to avoid circular dependencies at the module level.
registerDefaultResourceComponents({
  list: List,
  create: Create,
  edit: Edit,
  show: Detail,
});

registerFieldInputMapping(
  new Map<any, any>([
    [TextField, TextInput],
    [NumberField, NumberInput],
    [CurrencyField, NumberInput],
    [BooleanField, BooleanInput],
    [ReferenceField, ReferenceInput],
    [ArrayField, ArrayInput],
  ]),
);

export interface AdminProps extends CoreAdminProps {
  children?: AdminChildren;
  title?: string;
  /** Declarative Admin-level defaults. Pass a <Settings> element. */
  settings?: React.ReactElement<AdminSettings>;
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
  ready = Ready,
  i18nProvider = defaultI18nProvider,
  store = defaultStore,
  settings,
  ...props
}: AdminProps) => {
  const mergedSettings: AdminSettings = { ...FRAMEWORK_DEFAULTS, ...settings?.props };

  return (
    <SettingsContext.Provider value={mergedSettings}>
      <SchemaRegistryProvider>
        <CoreAdmin
          {...props}
          layout={(layoutProps: any) => <CloudscapeLayout {...layoutProps} layout={Layout} />}
          title={title}
          ready={ready}
          i18nProvider={i18nProvider}
          store={store}
        >
          {children}
        </CoreAdmin>
      </SchemaRegistryProvider>
    </SettingsContext.Provider>
  );
};

export default Admin;
