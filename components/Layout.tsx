'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeScreen from './WelcomeScreen';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const isNavigating = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Mark as navigating when pathname changes (not on first render)
    if (!isFirstRender.current) {
      isNavigating.current = true;
    } else {
      isFirstRender.current = false;
    }
    
    // Function to handle welcome screen visibility logic
    const handleWelcomeVisibility = () => {
      // Show welcome screen only on page load/refresh for home page,
      // not when navigating via the navbar
      if ((pathname === '/' || pathname === '/home') && !isNavigating.current) {
        setLoading(true);
      } else {
        // Don't show welcome screen on other pages or when navigating via navbar
        setLoading(false);
      }
    };

    // Run the visibility logic when the component mounts and pathname changes
    handleWelcomeVisibility();
    
    // Initialize AOS with enhanced configuration
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
      anchorPlacement: 'top-bottom',
      offset: 120,
    });

    // Refresh AOS when DOM changes
    const observer = new MutationObserver(() => {
      AOS.refresh();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setLoading(false);
    isNavigating.current = true; // Set as navigating after welcome screen completes
  };

  // Return welcome screen if loading
  if (loading) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030014] overflow-hidden">
      {/* Navbar is fixed at top */}
      <Navbar />
      
      {/* Main content without page transitions since we're using section-based approach */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 