import React from 'react';
import CloudscapeTopNavigation, { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { useLocale, useSetLocale, useLocales, useTranslate, useAuthProvider } from 'ra-core';

export const TopNavigation = ({ utilities: providedUtilities, identity, ...props }: TopNavigationProps) => {
    const locale = useLocale();
    const setLocale = useSetLocale();
    const locales = useLocales();
    const translate = useTranslate();
    const authProvider = useAuthProvider();

    let utilities = providedUtilities;

    if (!utilities) {
        const autoUtilities: any[] = [];

        if (locales && locales.length > 1) {
            autoUtilities.push({
                type: 'menu-dropdown',
                text: locales.find((l: any) => l.locale === locale)?.name || locale,
                iconName: 'globe',
                onItemClick: (event: any) => {
                    setLocale(event.detail.id);
                },
                items: locales.map((l: any) => ({
                    id: l.locale,
                    text: l.name,
                })),
            });
        }

        if (authProvider) {
            autoUtilities.push({
                type: 'menu-dropdown',
                text: translate('ra.auth.user_menu', { _: 'User' }),
                iconName: 'user-profile',
                items: [
                    { id: 'profile', text: translate('ra.auth.profile', { _: 'Profile' }) },
                    { id: 'signout', text: translate('ra.auth.logout', { _: 'Sign out' }) },
                ],
            });
        }
        utilities = autoUtilities;
    }

    return (
        <div id="header">
            <CloudscapeTopNavigation
                identity={identity || { title: 'Strato Admin', href: '/' }}
                utilities={utilities}
                {...props}
            />
        </div>
    );
};

export default TopNavigation;
