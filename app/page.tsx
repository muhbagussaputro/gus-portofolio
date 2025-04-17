import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// Import HomeWrapper sebagai Client Component
const HomeWrapper = dynamic(() => import('../components/HomeWrapper'), {
  loading: () => null
});

// Metadata untuk home page
export const metadata: Metadata = {
  title: 'Bagus - Full Stack Developer',
  description: 'Portfolio dari Bagus, seorang Full Stack Developer yang berpengalaman dalam React, Next.js, dan pengembangan aplikasi web modern.',
  openGraph: {
    title: 'Bagus - Full Stack Developer',
    description: 'Portfolio dari Bagus, seorang Full Stack Developer yang berpengalaman dalam React, Next.js, dan pengembangan aplikasi web modern.',
    images: ['/images/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <Suspense>
      <HomeWrapper />
    </Suspense>
  );
}
