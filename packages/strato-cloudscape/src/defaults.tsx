import type { AdminSettings } from '@strato-admin/core';
import { Message } from './i18n/Message';
import { Table } from './list';
import { DetailHub } from './detail';

/**
 * The framework's last-resort default values for all Admin-level configurable settings.
 * Override any of these via the `settings` prop on <Admin>.
 */
export const FRAMEWORK_DEFAULTS: AdminSettings = {
  listComponent: Table,
  detailComponent: DetailHub,
  editSuccessMessage: <Message>Element updated</Message>,
  deleteSuccessMessage: <Message>Element deleted</Message>,
  bulkDeleteSuccessMessage: (countDeleted: number) => (
    <Message vars={{ countDeleted }}>
      {'{countDeleted, plural, one {# element deleted} other {# elements deleted}}'}
    </Message>
  ),
  mutationMode: 'pessimistic',
  createRedirect: 'list',
  editRedirect: 'detail',
  listPageSize: 25,
  listPageSizes: [10, 25, 50, 100],
  listPageSizeLabel: (pageSize: number) => (
    <Message vars={{ pageSize }}>{'{pageSize, plural, one {# item} other {# items}}'}</Message>
  ),
};
