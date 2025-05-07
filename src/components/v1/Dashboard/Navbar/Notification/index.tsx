"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useCallback } from "react";

import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";
import NotificationService, {
  Notification as TNotification,
} from "@/services/notification";

export default function Notification() {
  const { translate } = useI18n("components.dashboard.navbar.notification");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const authService = new AuthService(supabase);
      const notificationService = new NotificationService(supabase);

      const userId = await authService.getUserId();
      if (!userId) {
        setNotifications([]);
        return;
      }

      const userNotifications =
        await notificationService.getNotificationsByUserId(userId);
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const notificationService = new NotificationService(supabase);
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="relative">
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        onClick={() => setNotificationsOpen((prev) => !prev)}
        className="relative p-2 text-gray-700 hover:text-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {translate("title")}
            </h2>
            {notifications.length > 0 && (
              <span className="text-sm text-gray-500">
                {notifications.length}{" "}
                {notifications.length === 1
                  ? translate("title")
                  : translate("title-plural")}
              </span>
            )}
          </div>

          {notifications.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`
                    py-3 transition-colors duration-150 ease-in-out cursor-pointer
                    ${notification.is_read ? "bg-white" : "bg-gray-50"}
                    hover:bg-gray-100 p-2
                  `}
                >
                  <div className="flex items-start gap-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {notification.description}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="shrink-0">
                        <div className="h-2 w-2 bg-blue-600 rounded-full" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                {translate("options.empty.title")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {translate("options.empty.description")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
