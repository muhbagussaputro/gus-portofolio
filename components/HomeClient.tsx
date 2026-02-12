'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import ParticleBackground from './ParticleBackground';
import BackgroundVideo from './BackgroundVideo';

// Menggunakan dynamic import dengan lazy loading yang dioptimalkan
const HeroSection = dynamic(() => import('@/app/(home)/HeroSection'), { 
  loading: () => null
});

// Menyiapkan section components dengan lazy loading yang lebih baik
const AboutSection = dynamic(() => import('@/app/about/AboutSection'));
const PortfolioSection = dynamic(() => import('@/app/portfolio/PortfolioSection'));
const CommunitySection = dynamic(() => import('@/app/community/CommunitySection'));
const ContactSection = dynamic(() => import('@/app/contact/ContactSection'));

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  
  // Setup Intersection Observer untuk lazy loading sections
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: portfolioRef, inView: portfolioInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: communityRef, inView: communityInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: contactRef, inView: contactInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    setMounted(true);

    // Memulihkan posisi scroll dari localStorage jika ada
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }

    // Menyimpan posisi scroll untuk sesi navigasi
    const handleBeforeUnload = () => {
      localStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!mounted) {
    return null; // Tidak perlu spinner karena kita sudah punya loading screen
  }

  return (
    <div className="bg-[#030014] text-white">
      {/* Particle Background dengan jumlah partikel yang dioptimalkan */}
      <ParticleBackground 
        particleCount={50}
        particleColors={['#4338ca', '#6366f1', '#8b5cf6', '#c026d3']}
        interactive={true}
      />
      
      {/* Dynamic Background Video from Database */}
      <BackgroundVideo 
        fallbackVideo="/videos/firestars.mp4"
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-60"
      />
      
      {/* Main content container dengan lazy loading sections */}
      <main className="relative z-10 overflow-hidden">
        <HeroSection />
        
        <div ref={aboutRef}>
          {aboutInView && <AboutSection />}
        </div>
        
        <div ref={portfolioRef}>
          {portfolioInView && <PortfolioSection />}
        </div>
        
        <div ref={communityRef}>
          {communityInView && <CommunitySection />}
        </div>
        
        <div ref={contactRef}>
          {contactInView && <ContactSection />}
        </div>
      </main>
    </div>
  );
} 