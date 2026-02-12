'use client';

import { useEffect } from 'react';

export default function VideoPreloadClient() {
  useEffect(() => {
    // Skip preloading in development to avoid issues
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      // Create video element for better preloading
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = '/videos/firestars.mp4';
      video.muted = true;
      video.style.display = 'none';
      
      // Add to DOM temporarily for preloading
      document.body.appendChild(video);

      // Handle load events
      video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded successfully');
      });

      video.addEventListener('error', (e) => {
        console.warn('Video preload error:', e);
      });

      return () => {
        // Cleanup
        try {
          if (video.parentNode === document.body) {
            document.body.removeChild(video);
          }
        } catch (err) {
          console.warn('Gagal membersihkan video preload:', err);
        }
      };
    } catch (error) {
      console.warn('Browser tidak mendukung video preload:', error);
      return () => {}; // Return empty cleanup
    }
  }, []);

  return null; // Komponen tidak merender apapun
}