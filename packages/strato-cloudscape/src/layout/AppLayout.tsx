import React, { useState } from 'react';
import CloudscapeAppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useResourceDefinitions, useTranslate, useDefaultTitle } from 'strato-core';
import { useNavigate } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import ThemeManager from '../theme/ThemeManager';

export interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  title?: string;
}

export const AppLayout = ({ children, header, title }: AppLayoutProps) => {
  const resources = useResourceDefinitions();
  const translate = useTranslate();
  const navigate = useNavigate();
  const defaultTitle = useDefaultTitle();
  const [navigationOpen, setNavigationOpen] = useState(true);

  const appTitle =
    title ?? (typeof defaultTitle === 'string' ? defaultTitle : '');

  const items = Object.values(resources).map((resource) => ({
    type: 'link' as const,
    text: resource.options?.label
      ? translate(resource.options.label, { _: resource.options.label })
      : translate(`resource.${resource.name}.name`, { _: resource.name }),
    href: `/${resource.name}`,
  }));

  return (
    <>
      <ThemeManager />
      {header || <TopNavigation identity={{ title: appTitle, href: '/' }} />}
      <CloudscapeAppLayout
        headerSelector="#header"
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        navigation={
          <SideNavigation
            //header={{
            //    href: '/',
            //    text: 'Dashboard',
            //}}
            items={items}
            onFollow={(event) => {
              if (!event.detail.external) {
                event.preventDefault();
                navigate(event.detail.href);
              }
            }}
          />
        }
        content={<div>{children}</div>}
      />
    </>
  );
};

export default AppLayout;
