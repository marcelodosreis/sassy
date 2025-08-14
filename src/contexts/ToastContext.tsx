"use client";

import React, { createContext, useState, ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  description: string;
  type: 'success' | 'error' | 'info';
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
