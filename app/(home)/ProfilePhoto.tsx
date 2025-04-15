'use client';

import React, { useState, useEffect } from 'react';
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
  imageUrl = '/images/profil.jpg',
  size = 250,
  withAnimation = true,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Load animation data dinamis
    import('@/public/animations/profile-animation.json')
      .then((data) => {
        setAnimationData(data.default);
      })
      .catch((error) => {
        console.error("Failed to load animation:", error);
      });
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const photoSize = typeof size === 'number' ? size : parseInt(size as string, 10);
  const framePadding = 30; // Padding untuk frame animasi
  const frameSize = photoSize + framePadding * 2;

  return (
    <div className="relative" style={{ width: frameSize, height: frameSize }}>
      {withAnimation && animationData && (
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
        {/* Border Gradient Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-xy shadow-lg shadow-blue-500/50"></div>
        
        {/* Inner Circle for Photo */}
        <div className="absolute inset-[5px] rounded-full overflow-hidden bg-[#030014]">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt="Foto Profil"
              width={photoSize}
              height={photoSize}
              className="object-cover"
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzYvLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLz/2wBDAR0dHR4eHRoaHSQtJSEkLzYvLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLy0vLz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-800 text-gray-400 text-xs">
              Gambar tidak tersedia
            </div>
          )}
        </div>

        {/* Fiery Star */}
        <motion.div
          className="absolute -top-8 -left-8 w-16 h-16"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="relative w-full h-full">
            {/* Star Shape */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-yellow-500 rounded-full"></div>
              <div className="absolute inset-0 bg-orange-500 rounded-full transform rotate-45"></div>
              <div className="absolute inset-0 bg-red-500 rounded-full transform rotate-90"></div>
            </div>
            
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md"></div>
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg"></div>
              <div className="absolute inset-0 bg-red-400 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePhoto; 