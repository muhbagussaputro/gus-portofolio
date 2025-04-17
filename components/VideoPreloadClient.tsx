'use client';

import { useEffect } from 'react';

export default function VideoPreloadClient() {
  useEffect(() => {
    try {
      // Buat preload link di client
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/videos/firestars.mp4';
      link.as = 'video';
      link.type = 'video/mp4';
      document.head.appendChild(link);

      // Cek ketersediaan video dengan fetch
      fetch('/videos/firestars.mp4', { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            console.warn('Video mungkin tidak tersedia:', response.status);
          }
        })
        .catch(error => {
          console.warn('Gagal memuat video:', error);
        });

      return () => {
        // Cleanup
        try {
          if (link.parentNode === document.head) {
            document.head.removeChild(link);
          }
        } catch (err) {
          console.warn('Gagal membersihkan link preload:', err);
        }
      };
    } catch (error) {
      console.warn('Browser tidak mendukung preload:', error);
      return () => {}; // Return empty cleanup
    }
  }, []);

  return null; // Komponen tidak merender apapun
} 