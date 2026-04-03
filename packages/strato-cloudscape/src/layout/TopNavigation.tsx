import CloudscapeTopNavigation, { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { useLocale, useSetLocale, useLocales, useTranslate, useAuthProvider, useStore } from '@strato-admin/ra-core';

export interface MyTopNavigationProps {
  identity?: TopNavigationProps.Identity;
  utilities?: ReadonlyArray<TopNavigationProps.Utility>;
  extraUtilities?: ReadonlyArray<TopNavigationProps.Utility>;
}

const LightModeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <path d="M8 1.5v13a6.5 6.5 0 0 0 0-13z" fill="currentColor" />
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
  </svg>
);

const DarkModeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <path d="M8 1.5v13a6.5 6.5 0 0 1 0-13z" fill="currentColor" />
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
  </svg>
);

export const TopNavigation = ({ utilities: providedUtilities, identity, extraUtilities }: MyTopNavigationProps) => {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const locales = useLocales();
  const translate = useTranslate();
  const authProvider = useAuthProvider();
  const [theme, setTheme] = useStore('theme', 'light');

  let utilities = providedUtilities;

  if (!utilities) {
    const autoUtilities: any[] = [];

    autoUtilities.push({
      type: 'button',
      iconSvg: theme === 'light' ? LightModeIcon : DarkModeIcon,
      onClick: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      },
      ariaLabel: translate('strato.action.toggle_theme', { _: 'Toggle theme' }),
    });

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
        text: translate('strato.auth.user_menu', { _: 'User' }),
        iconName: 'user-profile',
        items: [
          { id: 'profile', text: translate('strato.auth.profile', { _: 'Profile' }) },
          { id: 'signout', text: translate('strato.auth.logout', { _: 'Sign out' }) },
        ],
      });
    }
    utilities = extraUtilities ? [...autoUtilities, ...extraUtilities] : autoUtilities;
  }

  return (
    <div id="header">
      <CloudscapeTopNavigation
        identity={identity || { title: 'Strato Admin', href: '/' }}
        utilities={utilities}
      />
    </div>
  );
};

export default TopNavigation;
