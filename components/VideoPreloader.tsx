'use client';

import { useEffect } from 'react';

interface VideoPreloaderProps {
  videoPath: string;
}

export default function VideoPreloader({ videoPath }: VideoPreloaderProps) {
  useEffect(() => {
    // Preload video dengan metode link preload
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.href = videoPath;
    linkElement.as = 'video';
    linkElement.type = 'video/mp4';
    document.head.appendChild(linkElement);
    
    // Preload dengan metode fetch untuk memastikan video masuk cache browser
    const preloadVideo = async () => {
      try {
        const response = await fetch(videoPath, { method: 'GET' });
        if (response.ok) {
          console.log('Video preloaded successfully');
        }
      } catch (error) {
        console.error('Error preloading video:', error);
      }
    };
    
    preloadVideo();
    
    return () => {
      // Cleanup saat komponen unmount
      document.head.removeChild(linkElement);
    };
  }, [videoPath]);
  
  // Komponen tidak merender apapun ke DOM
  return null;
} 