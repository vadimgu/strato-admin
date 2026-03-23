import { useCallback } from 'react';
import { useBasename, CreatePathParams, removeDoubleSlashes } from '@strato-admin/ra-core';

/**
 * Strato version of useCreatePath that implements the new routing scheme:
 * - 'edit' -> /:resource/:id/edit
 * - 'show' -> /:resource/:id
 */
export const useCreatePath = () => {
  const basename = useBasename();
  return useCallback(
    ({ resource, id, type }: CreatePathParams): string => {
      if (['list', 'create', 'edit', 'show'].includes(type) && !resource) {
        throw new Error('Cannot create a link without a resource. You must provide the resource name.');
      }
      switch (type) {
        case 'list':
          return removeDoubleSlashes(`${basename}/${resource}`);
        case 'create':
          return removeDoubleSlashes(`${basename}/${resource}/create`);
        case 'edit': {
          if (id == null) {
            return removeDoubleSlashes(`${basename}/${resource}`);
          }
          return removeDoubleSlashes(`${basename}/${resource}/${encodeURIComponent(id)}/edit`);
        }
        case 'show': {
          if (id == null) {
            return removeDoubleSlashes(`${basename}/${resource}`);
          }
          return removeDoubleSlashes(`${basename}/${resource}/${encodeURIComponent(id)}`);
        }
        default:
          return type as string;
      }
    },
    [basename],
  );
};
