import { AppLayout, AppLayoutProps, TopNavigation } from '@strato-admin/admin';

const SOURCE_UTILITY = {
  type: 'button' as const,
  text: 'Source code',
  href: 'https://github.com/vadimgu/strato-admin/tree/main/examples/demo',
  external: true,
};

export const DemoLayout = ({ children, title }: AppLayoutProps) => (
  <AppLayout
    title={title}
    header={
      <TopNavigation
        identity={{ title: title ?? 'Strato E-commerce Demo', href: '/' }}
        extraUtilities={[SOURCE_UTILITY]}
      />
    }
  >
    {children}
  </AppLayout>
);
