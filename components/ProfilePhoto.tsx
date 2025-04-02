'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import profileAnimation from '@/public/animations/profile-animation.json';

// Import Lottie secara dinamis untuk menghindari error SSR
const Lottie = dynamic(() => import('react-lottie'), {
  ssr: false,
});

interface ProfilePhotoProps {
  imageUrl?: string;
  size?: number | string;
  withAnimation?: boolean;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  imageUrl = '/images/profile.jpg',
  size = 250,
  withAnimation = true,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: profileAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const photoSize = typeof size === 'number' ? size : parseInt(size as string, 10);
  const framePadding = 30; // Padding untuk frame animasi
  const frameSize = photoSize + framePadding * 2;

  return (
    <div className="relative" style={{ width: frameSize, height: frameSize }}>
      {withAnimation && (
        <div className="absolute inset-0 z-0">
          <Lottie options={defaultOptions} height={frameSize} width={frameSize} />
        </div>
      )}
      
      <motion.div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: `${framePadding}px`,
          left: `${framePadding}px`,
          width: photoSize,
          height: photoSize,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image
          src={imageUrl}
          alt="Foto Profil"
          width={photoSize}
          height={photoSize}
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
};

export default ProfilePhoto; 