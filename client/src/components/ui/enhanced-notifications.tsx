import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const notificationStyles = {
  success: 'border-green-500/30 bg-green-900/20 text-green-400',
  error: 'border-red-500/30 bg-red-900/20 text-red-400',
  warning: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-400',
  info: 'border-blue-500/30 bg-blue-900/20 text-blue-400',
};

function NotificationItem({ notification, onClose }: NotificationProps) {
  const Icon = notificationIcons[notification.type];
  const styleClass = notificationStyles[notification.type];

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onClose]);

  return (
    <div className={`glassmorphic-intense rounded-2xl border p-4 shadow-2xl slide-in-up ${styleClass}`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{notification.title}</p>
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const notifications: Notification[] = [];
let setNotifications: React.Dispatch<React.SetStateAction<Notification[]>> | null = null;

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  
  setNotifications = setNotificationList;

  const removeNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {notificationList.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </>
  );
}

export function addNotification(notification: Omit<Notification, 'id'>) {
  if (setNotifications) {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }
  return null;
}

export function removeNotification(id: string) {
  if (setNotifications) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }
}

// Convenience functions
export const notify = {
  success: (title: string, message: string, duration?: number) =>
    addNotification({ type: 'success', title, message, duration }),
  error: (title: string, message: string, duration?: number) =>
    addNotification({ type: 'error', title, message, duration }),
  warning: (title: string, message: string, duration?: number) =>
    addNotification({ type: 'warning', title, message, duration }),
  info: (title: string, message: string, duration?: number) =>
    addNotification({ type: 'info', title, message, duration }),
};