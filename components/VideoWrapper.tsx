'use client';

import dynamic from 'next/dynamic';

// Import VideoPreloader dengan dynamic import di Client Component
const VideoPreloader = dynamic(() => import('@/components/VideoPreloader'), {
  ssr: false
});

interface VideoWrapperProps {
  videoPath: string;
}

export default function VideoWrapper({ videoPath }: VideoWrapperProps) {
  return <VideoPreloader videoPath={videoPath} />;
} 