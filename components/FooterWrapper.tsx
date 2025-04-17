'use client';

import dynamic from 'next/dynamic';

// Import Footer dengan ssr: false dalam Client Component
const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
});

export default function FooterWrapper() {
  return <Footer />;
} 