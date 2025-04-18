"use client";

import { BellIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

import './style.css';

function Notification() {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Notification 1', description: 'Description 1', read: false },
        { id: 2, message: 'Notification 2', description: 'Description 2', read: false },
        { id: 3, message: 'Notification 3', description: 'Description 3', read: true },
    ]);

    const unreadCount = notifications.filter(notification => !notification.read).length;
    const notificationsRef = useRef<HTMLDivElement>(null);

    const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleClickOutside = (event: { target: unknown; }) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setNotificationsOpen(false);
        }
    };

    useEffect(() => {
        if (notificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationsOpen]);

    return (
        <div className="relative cursor-pointer" ref={notificationsRef}>
            <div onClick={toggleNotifications}>
                <BellIcon className="h-6 w-6 text-gray-700 hover:text-indigo-600" />
                {unreadCount > 0 && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>

            {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h2>
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.map(notification => (
                            <li
                                key={notification.id}
                                className={`mt-2 p-2 rounded-md ${notification.read ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 cursor-pointer flex justify-between`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div>
                                    <p className="font-semibold text-gray-600">{notification.message}</p>
                                    <p className="text-sm text-gray-600">{notification.description}</p>
                                </div>
                                {!notification.read && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Notification;
