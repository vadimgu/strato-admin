import React from 'react';
import { useTranslate } from '@strato-admin/ra-core';
import { MessageProps } from './types';

export type { MessageProps };

/**
 * Renders a translatable string inline. The children text is the English source
 * string and serves as both the translation key and the fallback value.
 *
 * @example
 * <Message>Product Name</Message>
 * <Message id="resources.products.actions.archive">Archive</Message>
 * <Message context="verb">Archive</Message>
 * <Message context="noun">Archive</Message>
 * <Message comment="Appears in the confirmation dialog">Are you sure?</Message>
 * <Message count={n}>{'Found {count, plural, one {# result} other {# results}}'}</Message>
 */
export const Message = ({ children, id, context, comment: _comment, vars }: MessageProps) => {
  const translate = useTranslate();
  const key = id ?? (context ? `${context}\x04${children}` : children);
  return <>{translate(key, { ...vars, _: children })}</>;
};
