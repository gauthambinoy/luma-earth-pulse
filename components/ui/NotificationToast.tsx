"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ════════════════════════════════════════════
// NOTIFICATION TYPES
// ════════════════════════════════════════════

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  timestamp: number;
  duration?: number; // ms, 0 = persistent
}

const TYPE_STYLES: Record<NotificationType, { border: string; bg: string; icon: string }> = {
  info: { border: "rgba(96,165,250,0.4)", bg: "rgba(96,165,250,0.08)", icon: "ℹ️" },
  success: { border: "rgba(110,231,183,0.4)", bg: "rgba(110,231,183,0.08)", icon: "✅" },
  warning: { border: "rgba(251,191,36,0.4)", bg: "rgba(251,191,36,0.08)", icon: "⚠️" },
  alert: { border: "rgba(248,113,113,0.4)", bg: "rgba(248,113,113,0.08)", icon: "🚨" },
};

// ════════════════════════════════════════════
// CONTEXT
// ════════════════════════════════════════════

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearAll: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

// ════════════════════════════════════════════
// PROVIDER
// ════════════════════════════════════════════

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const notification: Notification = { ...n, id, timestamp: Date.now() };
    setNotifications((prev) => [...prev.slice(-4), notification]); // keep max 5

    // Auto-dismiss after duration
    const duration = n.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((x) => x.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationToasts />
    </NotificationContext.Provider>
  );
}

// ════════════════════════════════════════════
// TOAST DISPLAY
// ════════════════════════════════════════════

function NotificationToasts() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2" style={{ maxWidth: 360 }}>
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => {
          const style = TYPE_STYLES[n.type];
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto rounded-xl border p-3 shadow-lg"
              style={{
                background: "rgba(10,15,26,0.95)",
                borderColor: style.border,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-lg">{n.icon ?? style.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-white truncate">{n.title}</div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="shrink-0 text-xs text-gray-500 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400 line-clamp-2">{n.message}</div>
                  <div className="mt-1 text-[9px] text-gray-600">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
