'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import komponen dengan lazy loading
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'));
const HomeClient = dynamic(() => import('@/components/HomeClient'), {
  loading: () => null
});

// Import komponen preload video dengan ssr: false (hanya diizinkan di client)
const VideoPreloadClient = dynamic(() => import('@/components/VideoPreloadClient'), {
  ssr: false
});

export default function HomeWrapper() {
  return (
    <>
      {/* Preload video */}
      <VideoPreloadClient />
      
      {/* Loading screen dengan durasi 5 detik */}
      <LoadingScreen minimumLoadTimeMs={5000} />
      
      {/* Konten utama */}
      <Suspense>
        <HomeClient />
      </Suspense>
    </>
  );
} 