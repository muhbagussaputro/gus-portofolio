'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import komponen dengan lazy loading
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'));
const HomeClient = dynamic(() => import('@/components/HomeClient'), {
  loading: () => null
});

export default function HomeWrapper() {
  return (
    <>
      {/* Loading screen dengan durasi 5 detik */}
      <LoadingScreen minimumLoadTimeMs={5000} />
      
      {/* Konten utama */}
      <Suspense>
        <HomeClient />
      </Suspense>
    </>
  );
}