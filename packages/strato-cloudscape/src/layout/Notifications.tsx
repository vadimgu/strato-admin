import { useCallback, useEffect, useRef } from 'react';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import { useNotificationContext, useTranslate, NotificationPayload } from '@strato-admin/ra-core';

const DEFAULT_AUTO_HIDE_MS = null;

let idCounter = 0;
const stableIds = new WeakMap<object, string>();
const getStableId = (obj: object): string => {
  if (!stableIds.has(obj)) stableIds.set(obj, String(++idCounter));
  return stableIds.get(obj)!;
};

export const Notifications = () => {
  const { notifications, setNotifications } = useNotificationContext();
  const translate = useTranslate();
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback(
    (notification: NotificationPayload) => {
      const id = getStableId(notification);
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      setNotifications((prev: NotificationPayload[]) => prev.filter((n) => n !== notification));
    },
    [setNotifications],
  );

  useEffect(() => {
    notifications.forEach((notification) => {
      const id = getStableId(notification);
      if (timers.current.has(id)) return;
      const ms = notification.notificationOptions?.autoHideDuration ?? DEFAULT_AUTO_HIDE_MS;
      if (ms === null) return;
      timers.current.set(
        id,
        setTimeout(() => dismiss(notification), ms),
      );
    });

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, [notifications, dismiss]);

  if (notifications.length === 0) return null;

  const items: FlashbarProps.MessageDefinition[] = notifications.map((notification) => {
    const { message, type, notificationOptions } = notification;
    return {
      id: getStableId(notification),
      type,
      content: typeof message === 'string' ? translate(message, notificationOptions?.messageArgs) : message,
      dismissible: true,
      onDismiss: () => dismiss(notification),
    };
  });

  return <Flashbar items={items} />;
};
