import React from 'react';
import {
  CoreAdminContext,
  ResourceContext,
  RecordContext,
  ResourceDefinitionContextProvider,
  ListContextProvider,
  type RaRecord,
} from 'strato-core';
import { icuI18nProvider } from 'strato-i18n';
import englishMessages from 'strato-language-en';

const i18nProvider = icuI18nProvider(() => englishMessages as any, 'en');

export const withRaContext =
  (
    record: RaRecord = { id: 1 },
    resource: string = 'samples',
    definitions: any = { samples: { name: 'samples', hasCreate: true, hasEdit: true, hasList: true, hasShow: true } },
    listContext: any = null,
  ) =>
  (Story: React.ComponentType) => (
    <CoreAdminContext dataProvider={{} as any} i18nProvider={i18nProvider}>
      <ResourceDefinitionContextProvider definitions={definitions}>
        <ResourceContext.Provider value={resource}>
          <RecordContext.Provider value={record}>
            {listContext ? (
              <ListContextProvider value={listContext}>
                <Story />
              </ListContextProvider>
            ) : (
              <Story />
            )}
          </RecordContext.Provider>
        </ResourceContext.Provider>
      </ResourceDefinitionContextProvider>
    </CoreAdminContext>
  );
