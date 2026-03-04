import React from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';

export interface AppBarProps {
    title?: string;
}

export const AppBar = ({ title = 'Strato Admin' }: AppBarProps) => {
    return (
        <div id="header">
            <TopNavigation
                identity={{
                    href: '/',
                    title: title,
                }}
                utilities={[
                    {
                        type: 'button',
                        iconName: 'notification',
                        ariaLabel: 'Notifications',
                        badge: true,
                        disableUtilityCollapse: true,
                    },
                    {
                        type: 'menu-dropdown',
                        iconName: 'settings',
                        ariaLabel: 'Settings',
                        items: [
                            { id: 'settings', text: 'Settings' },
                            { id: 'preferences', text: 'Preferences' },
                        ],
                    },
                    {
                        type: 'menu-dropdown',
                        text: 'User',
                        iconName: 'user-profile',
                        items: [
                            { id: 'profile', text: 'Profile' },
                            { id: 'signout', text: 'Sign out' },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default AppBar;
