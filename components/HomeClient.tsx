'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import ParticleBackground from './ParticleBackground';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
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

  // Mengoptimalkan pemutaran video
  useEffect(() => {
    if (!mounted) return;
    
    // Cek apakah image poster ada, jika tidak buat default
    const checkPosterImage = async () => {
      try {
        const response = await fetch('/images/night.png', { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Poster image tidak ditemukan');
        }
      } catch (error) {
        console.warn('Gagal mengecek poster image');
      }
    };
    
    checkPosterImage();
    
    const playVideoWhenReady = async () => {
      if (!videoRef.current) return;
      
      try {
        // Video sudah di-preload di komponen VideoPreloadClient
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
          setVideoLoaded(true);
        } else {
          videoRef.current.addEventListener('loadeddata', async () => {
            try {
              await videoRef.current?.play();
              setVideoLoaded(true);
            } catch (err) {
              setVideoError(true);
            }
          }, { once: true });
        }
      } catch (err) {
        setVideoError(true);
      }
    };

    // Putar video setelah sedikit delay agar loading screen bisa muncul dulu
    const timer = setTimeout(playVideoWhenReady, 500);
    
    return () => {
      clearTimeout(timer);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, [mounted]);

  // Handler yang dioptimalkan untuk event video
  const handleVideoCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setVideoLoaded(true))
        .catch(() => {
          console.warn('Tidak dapat memutar video secara otomatis, kemungkinan perlu interaksi user di beberapa browser');
          setVideoError(true);
        });
    }
  }, []);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Error loading video:', e?.currentTarget?.error || 'unknown error');
    setVideoError(true);
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
      
      {/* Video background container dengan optimasi */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        {videoError ? (
          <div className="absolute inset-0 bg-[#030014] flex items-center justify-center opacity-30">
            <p className="text-gray-400 text-sm">Video background tidak dapat dimuat</p>
          </div>
        ) : (
          <>
            <video
              className="absolute min-w-full min-h-full object-cover opacity-60"
              autoPlay
              muted
              loop
              playsInline
              poster={'/images/night.png'}
              ref={videoRef}
              onCanPlay={handleVideoCanPlay}
              onError={handleVideoError}
            >
              <source src="/videos/firestars.mp4" type="video/mp4" />
              <source src="/videos/firestars.webm" type="video/webm" />
              Maaf, browser Anda tidak mendukung tag video.
            </video>
          </>
        )}
        
        <div className="absolute inset-0 bg-[#030014] opacity-70"></div>
      </div>
      
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