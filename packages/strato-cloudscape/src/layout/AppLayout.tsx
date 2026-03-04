import React, { useState } from 'react';
import CloudscapeAppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useResourceDefinitions } from 'ra-core';
import { useNavigate } from 'react-router-dom';
import { AppBar } from './AppBar';

export interface AppLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    title?: string;
}

export const AppLayout = ({ children, header, title }: AppLayoutProps) => {
    const resources = useResourceDefinitions();
    const navigate = useNavigate();
    const [navigationOpen, setNavigationOpen] = useState(true);

    const items = Object.values(resources).map((resource) => ({
        type: 'link' as const,
        text: resource.options?.label || resource.name,
        href: `/${resource.name}`,
    }));

    return (
        <>
            {header || <AppBar title={title} />}
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
                content={
                    <div>
                        {children}
                    </div>
                }
            />
        </>
    );
};

export default AppLayout;
