'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Transformasi nilai scroll untuk efek parallax vertikal
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Handle pergerakan mouse untuk efek parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePosition({
        x: (clientX - centerX) / 50, // Faktor pergeseran horizontal
        y: (clientY - centerY) / 50  // Faktor pergeseran vertikal
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Lapisan background parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y: y1,
          x: mousePosition.x / 2,
          opacity
        }}
      >
        <div className="w-full h-full">
          <div className="blur-bg top-1/4 left-1/4 w-64 h-64 animate-pulse-slow opacity-40"></div>
          <div className="blur-bg bottom-1/4 right-1/4 w-80 h-80 animate-pulse-slow opacity-30"></div>
        </div>
      </motion.div>

      {/* Lapisan tengah parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y: y2,
          x: mousePosition.x,
          opacity
        }}
      >
        <div className="w-full h-full">
          <div className="blur-bg top-1/3 right-1/3 w-52 h-52 animate-pulse-slow opacity-20"></div>
          <div className="blur-bg bottom-1/3 left-1/3 w-40 h-40 animate-pulse-slow opacity-25"></div>
        </div>
      </motion.div>

      {/* Lapisan depan parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y: y3,
          x: mousePosition.x * 1.5,
          opacity 
        }}
      >
        <div className="w-full h-full">
          <div className="gradient-orbs top-1/2 left-1/2 w-32 h-32 animate-float"></div>
          <div className="gradient-orbs top-3/4 right-1/3 w-24 h-24 animate-float-slow"></div>
          <div className="gradient-orbs bottom-1/4 left-1/4 w-20 h-20 animate-float-reverse"></div>
        </div>
      </motion.div>

      {/* Pola grid */}
      <div className="absolute inset-0 z-0 grid-pattern opacity-5"></div>

      {/* Konten */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground; 