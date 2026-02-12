'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 8000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      hideToast(id);
    }, newToast.duration);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-100';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-100';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-100';
      default:
        return 'bg-green-500/10 border-green-500/20 text-green-100';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              className={`
                max-w-md w-full p-5 rounded-xl border backdrop-blur-sm
                ${getToastColors(toast.type)}
                shadow-xl
              `}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getToastIcon(toast.type)}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium">
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="mt-1 text-sm opacity-90">
                      {toast.message}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => hideToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.showToast({ type: 'success', title, message, duration });
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.showToast({ type: 'error', title, message, duration });
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.showToast({ type: 'warning', title, message, duration });
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    const context = useContext(ToastContext);
    if (context) {
      context.showToast({ type: 'info', title, message, duration });
    }
  },
};