'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Sedikit delay untuk memastikan animasi fade-in terjadi setelah
    // loading screen keluar
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="min-h-screen flex flex-col bg-[#030014] overflow-hidden"
    >
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
    </motion.div>
  );
} 