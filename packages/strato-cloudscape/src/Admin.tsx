import React, { useMemo } from 'react';
import { CoreAdminContext, CoreAdminUI, AdminRouter, type CoreAdminContextProps } from 'ra-core';
import { AppLayout } from './layout';

export interface AdminProps extends CoreAdminContextProps {
    children: React.ReactNode;
    title?: string;
}

export const Admin = ({ children, title, ...props }: AdminProps) => {
    const Layout = useMemo(() => (layoutProps: any) => (
        <AppLayout {...layoutProps} title={title} />
    ), [title]);

    return (
        <CoreAdminContext {...props}>
            <AdminRouter>
                <CoreAdminUI layout={Layout}>
                    {children}
                </CoreAdminUI>
            </AdminRouter>
        </CoreAdminContext>
    );
};

export default Admin;
