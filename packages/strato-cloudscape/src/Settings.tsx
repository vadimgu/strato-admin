import type { AdminSettings } from '@strato-admin/core';

/**
 * Declarative configuration for Admin-level defaults.
 * Pass as the `settings` prop on <Admin>.
 *
 * @example
 * <Admin
 *   settings={<Settings listComponent={MyTable} deleteSuccessMessage="Deleted!" />}
 *   dataProvider={myDataProvider}
 * >
 *   <Resource name="products" />
 * </Admin>
 */
export const Settings = (_: AdminSettings): null => null;
Settings.displayName = 'Settings';
