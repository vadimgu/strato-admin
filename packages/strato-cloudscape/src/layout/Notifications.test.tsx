import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Notifications } from './Notifications';
import { useNotificationContext, useTranslate } from '@strato-admin/ra-core';

vi.mock('@strato-admin/ra-core', () => import('../__mocks__/ra-core'));

vi.mock('@cloudscape-design/components/flashbar', () => ({
  default: ({ items }: any) => (
    <div data-testid="flashbar">
      {items.map((item: any) => (
        <div key={item.id} data-testid={`flash-item-${item.id}`} data-type={item.type}>
          <span data-testid="flash-content">{item.content}</span>
          {item.dismissible && (
            <button data-testid={`dismiss-${item.id}`} onClick={item.onDismiss}>
              Dismiss
            </button>
          )}
        </div>
      ))}
    </div>
  ),
}));

describe('Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when there are no notifications', () => {
    (useNotificationContext as any).mockReturnValue({ notifications: [], setNotifications: vi.fn() });
    const { container } = render(<Notifications />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a Flashbar item for each notification', () => {
    const n1 = { message: 'Saved', type: 'success' as const };
    const n2 = { message: 'Error occurred', type: 'error' as const };
    (useNotificationContext as any).mockReturnValue({
      notifications: [n1, n2],
      setNotifications: vi.fn(),
    });
    render(<Notifications />);
    expect(screen.getByTestId('flashbar')).toBeDefined();
    expect(screen.getAllByTestId('flash-content')).toHaveLength(2);
  });

  it('passes the correct type to each Flashbar item', () => {
    const types = ['success', 'info', 'warning', 'error'] as const;
    const notifications = types.map((type) => ({ message: type, type }));
    (useNotificationContext as any).mockReturnValue({ notifications, setNotifications: vi.fn() });
    render(<Notifications />);
    const items = screen.getAllByTestId(/^flash-item-/);
    expect(items.map((el) => el.getAttribute('data-type'))).toEqual(types);
  });

  it('translates string messages', () => {
    (useTranslate as any).mockReturnValue((key: string) => `translated:${key}`);
    (useNotificationContext as any).mockReturnValue({
      notifications: [{ message: 'ra.action.save', type: 'success' as const }],
      setNotifications: vi.fn(),
    });
    render(<Notifications />);
    expect(screen.getByTestId('flash-content').textContent).toBe('translated:ra.action.save');
  });

  it('calls setNotifications to remove the dismissed notification', () => {
    const notification = { message: 'Done', type: 'success' as const };
    const setNotifications = vi.fn();
    (useNotificationContext as any).mockReturnValue({
      notifications: [notification],
      setNotifications,
    });
    render(<Notifications />);
    const dismissButtons = screen.getAllByTestId(/^dismiss-/);
    fireEvent.click(dismissButtons[0]);
    expect(setNotifications).toHaveBeenCalled();
    const updater = setNotifications.mock.calls[0][0];
    const result = updater([notification, { message: 'Other', type: 'info' as const }]);
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe('Other');
  });

  it('does not auto-hide when autoHideDuration is null', () => {
    vi.useFakeTimers();
    const notification = {
      message: 'Persistent',
      type: 'info' as const,
      notificationOptions: { autoHideDuration: null },
    };
    const setNotifications = vi.fn();
    (useNotificationContext as any).mockReturnValue({
      notifications: [notification],
      setNotifications,
    });
    render(<Notifications />);
    vi.advanceTimersByTime(10000);
    expect(setNotifications).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
