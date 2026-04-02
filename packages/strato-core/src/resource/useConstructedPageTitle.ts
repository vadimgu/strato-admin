import { useResourceContext, useLocale } from '@strato-admin/ra-core';
import { humanize, singularize, pluralize } from 'inflection';

export function useConstructedPageTitle(type: 'create' | 'edit' | 'show' | 'list', customLabel?: string): string {
  const resource = useResourceContext();
  const locale = useLocale();

  const baseName = customLabel || resource || '';
  if (!baseName) return '';

  if (!locale.startsWith('en')) {
    return '';
  }

  const humanized = humanize(baseName);
  const singular = singularize(humanized);
  const plural = pluralize(humanized);

  switch (type) {
    case 'create':
      return `Create ${singular}`;
    case 'edit':
      return `Edit ${singular}`;
    case 'show':
      return `${singular} Details`;
    case 'list':
      return plural;
    default:
      return singular;
  }
}
