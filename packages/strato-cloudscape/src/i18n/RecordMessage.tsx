import { useTranslate, useRecordContext } from '@strato-admin/ra-core';
import { MessageProps } from './types';

export interface RecordMessageProps extends MessageProps {
  /** Explicit record to use instead of the one from context. */
  record?: Record<string, any>;
}

/**
 * Renders a translatable string with all fields of the current record available
 * as ICU variables. Must be used inside a record context (Detail, Edit, etc.).
 *
 * @example
 * <RecordMessage>{'Product: {name}'}</RecordMessage>
 * <RecordMessage>{'Order #{id} — {status}'}</RecordMessage>
 */
export const RecordMessage = ({ children, id, context, comment: _comment, record, vars }: RecordMessageProps) => {
  const translate = useTranslate();
  const resolvedRecord = useRecordContext({ record }) ?? {};
  const key = id ?? (context ? `${context}\x04${children}` : children);
  return <>{translate(key, { ...resolvedRecord, ...vars, _: children })}</>;
};
