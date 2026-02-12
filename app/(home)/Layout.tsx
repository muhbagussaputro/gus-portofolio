'use client';

import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import { ToastProvider } from '@/components/Toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </ToastProvider>
  );
}