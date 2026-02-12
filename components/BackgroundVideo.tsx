'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHomepageAssets } from '@/hooks/useHomepageAssets';

interface BackgroundVideoProps {
  fallbackVideo?: string;
  className?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  fallbackVideo = '/videos/firestars.mp4',
  className = 'fixed inset-0 w-full h-full object-cover z-0'
}) => {
  const { getActiveAssetsByType, isLoading, error } = useHomepageAssets();
  const [videoError, setVideoError] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get all active background videos from database
  const backgroundVideos = getActiveAssetsByType('background_video') || [];
  
  // Create video list with fallback and sort by priority and sort_order
   const sortedVideos = backgroundVideos.sort((a: any, b: any) => {
     // First sort by priority (high > normal > low)
     const priorityOrder: { [key: string]: number } = { high: 3, normal: 2, low: 1 };
     const aPriority = priorityOrder[a.metadata?.priority as string || 'normal'] || 2;
     const bPriority = priorityOrder[b.metadata?.priority as string || 'normal'] || 2;
     
     if (aPriority !== bPriority) {
       return bPriority - aPriority;
     }
     
     // Then sort by sort_order
     return (a.sort_order || 0) - (b.sort_order || 0);
   });
  
  const videoList = sortedVideos.length > 0 
    ? sortedVideos.map((asset: any) => asset.file_url)
    : [fallbackVideo];
    
  // Get settings from the first video's metadata or use defaults
  const firstVideoMetadata = sortedVideos[0]?.metadata || {};
  const rotationInterval = firstVideoMetadata.rotationInterval || 30;
  const enableMobileOptimization = firstVideoMetadata.enableMobileOptimization !== false;
  const autoPlay = firstVideoMetadata.autoplay !== false;
  const muted = firstVideoMetadata.muted !== false;
  const loop = firstVideoMetadata.loop !== false;
  const preload = firstVideoMetadata.preload || 'metadata';
  
  // Current video URL
  const currentVideoUrl = videoList[currentVideoIndex] || fallbackVideo;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video rotation logic
  const rotateVideo = useCallback(() => {
    if (videoList.length > 1) {
      setCurrentVideoIndex((prevIndex) => 
        (prevIndex + 1) % videoList.length
      );
    }
  }, [videoList.length]);

  // Setup rotation timer
  useEffect(() => {
    if (videoList.length > 1 && rotationInterval > 0) {
      rotationTimerRef.current = setInterval(rotateVideo, rotationInterval * 1000);
      
      return () => {
        if (rotationTimerRef.current) {
          clearInterval(rotationTimerRef.current);
        }
      };
    }
  }, [rotateVideo, rotationInterval, videoList.length]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error state when video URL changes
    setVideoError(false);

    const handleCanPlay = () => {
      if (autoPlay) {
        video.play().catch((err) => {
          console.warn('Video autoplay failed:', err);
        });
      }
    };

    const handleError = () => {
      setVideoError(true);
      console.error('Failed to load video:', currentVideoUrl);
      // Auto-rotate to next video on error if multiple videos available
      if (videoList.length > 1) {
        setTimeout(rotateVideo, 2000);
      }
    };

    const handleEnded = () => {
      // Rotate to next video when current video ends
      if (videoList.length > 1) {
        rotateVideo();
      } else if (loop) {
        // If only one video and loop is enabled, restart it
        video.currentTime = 0;
        video.play().catch((err) => {
          console.warn('Video replay failed:', err);
        });
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoUrl, autoPlay, loop, rotateVideo, videoList.length]);

  // Don't render anything if there's an error loading assets
  if (error && !fallbackVideo) {
    console.error('Background video error:', error);
    return null;
  }

  // Mobile-optimized className
  const responsiveClassName = enableMobileOptimization && isMobile
    ? `${className} scale-110 sm:scale-100` // Slightly larger on mobile for better coverage
    : className;

  return (
    <>
      {!videoError ? (
        <video
          ref={videoRef}
          className={responsiveClassName}
          autoPlay={autoPlay}
          muted={muted}
          loop={videoList.length === 1 ? loop : false} // Only loop if single video
          preload={isMobile ? 'none' : preload} // Optimize for mobile data usage
          playsInline
          key={`${currentVideoUrl}-${currentVideoIndex}`} // Force re-render when URL changes
          style={{
            // Additional mobile optimizations
            ...(enableMobileOptimization && isMobile && {
              transform: 'scale(1.1)',
              transformOrigin: 'center center'
            })
          }}
        >
          <source src={currentVideoUrl} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="fixed inset-0 bg-[#030014] z-0" />
        </video>
      ) : (
        // Fallback background if video fails to load
        <div className="fixed inset-0 bg-gradient-to-br from-[#030014] via-[#0a0a29] to-[#1e1e3f] z-0" />
      )}
      
      {/* Optional loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#030014] z-0 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            {isMobile ? 'Loading...' : 'Loading video...'}
          </div>
        </div>
      )}
      
      {/* Video overlay for better text readability */}
      <div className="fixed inset-0 bg-black/20 z-[1] pointer-events-none" />
      
      {/* Video rotation indicator (only show if multiple videos) */}
       {videoList.length > 1 && (
         <div className="fixed bottom-4 right-4 z-[2] flex space-x-1">
           {videoList.map((_: string, index: number) => (
             <div
               key={index}
               className={`w-2 h-2 rounded-full transition-all duration-300 ${
                 index === currentVideoIndex 
                   ? 'bg-white/80' 
                   : 'bg-white/30'
               }`}
             />
           ))}
         </div>
       )}
    </>
  );
};

export default BackgroundVideo;