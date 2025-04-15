'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NavLink from './NavLink';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Community', href: '#komunitas' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const navHeight = 90; // Approx height of navbar in pixels

  // Deteksi scroll untuk styling Navbar dan active section
  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled style when scrolled down
      setIsScrolled(window.scrollY > 50);
      
      // Detect which section is in view
      const sections = document.querySelectorAll('section[id]');
      let currentActiveSection = '';

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        // If the section is in the viewport (with offset for navbar)
        // Increased offset to ensure better detection
        if (sectionTop <= navHeight + 50 && sectionTop + sectionHeight > navHeight) {
          currentActiveSection = section.id;
        }
      });

      // Only update state if changed and not empty
      if (currentActiveSection && currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once to initialize
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, navHeight]);

  // Variasi animasi untuk Navbar ketika scroll
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20 
      }
    }
  };

  // Scroll to section function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // Extract the section ID from href
    const sectionId = href.replace('#', '');
    const section = document.getElementById(sectionId);
    
    if (section) {
      // Calculate position with offset for navbar
      const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      // Smooth scroll to section with offset
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update active section
      setActiveSection(sectionId);
    }
  };

  // Check if link is active
  const isLinkActive = (href: string) => {
    const sectionId = href.replace('#', '');
    return sectionId === activeSection;
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#030014]/80 backdrop-blur-md shadow-md border-b border-indigo-500/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="#home" 
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={(e) => scrollToSection(e, '#home')}
          >
            Portfolio
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink 
                key={item.name}
                item={item}
                isActive={isLinkActive(item.href)}
                onClick={(e) => scrollToSection(e, item.href)}
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#030014]/90 backdrop-blur-md border-b border-indigo-500/10"
          >
            <div className="container py-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`block py-2 text-white hover:text-indigo-400 transition-colors font-bold ${
                    isLinkActive(item.href) ? 'text-indigo-400 border-l-2 border-indigo-400 pl-2' : ''
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
} 