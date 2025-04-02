'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, 
  ExternalLink, Code, Zap, Send, 
  Database, Globe, Layers, Monitor
} from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Layout from '@/components/Layout';

// Dynamically import Lottie with ssr: false option
const Lottie = dynamic(() => import('react-lottie'), {
  ssr: false,
});

// Memoized components for performance
const StatusBadge = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center px-3 py-1 rounded-full 
      bg-gradient-to-r from-indigo-500/10 to-purple-600/10
      border border-indigo-500/20 mb-6"
    data-aos="fade-down"
    data-aos-delay="200"
  >
    <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
    <span className="text-indigo-300 text-sm font-medium">Ready to Innovate</span>
  </motion.div>
));

// Tech stack item component
const TechItem = memo(({ icon: Icon, name, delay }: { icon: any, name: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
    className="flex items-center p-3 rounded-lg 
      bg-[#0a0a29]/40 border border-indigo-500/10 
      hover:bg-indigo-500/10 hover:border-indigo-500/30 
      transition-all duration-300"
    data-aos="fade-up"
    data-aos-delay={delay * 100}
  >
    <Icon size={18} className="text-indigo-400 mr-2" />
    <span className="text-white/80">{name}</span>
  </motion.div>
));

// Social link component
const SocialLink = memo(({ icon: Icon, href, delay }: { icon: any, href: string, delay: number }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      delay: delay * 0.1,
      type: "spring",
      stiffness: 260,
      damping: 20
    }}
    whileHover={{ 
      scale: 1.2,
      backgroundColor: "rgba(99, 102, 241, 0.2)"
    }}
    className="p-3 rounded-full bg-[#0a0a29]/50 border border-indigo-500/20 
      hover:border-indigo-500/50 transition-colors duration-300"
    data-aos="zoom-in"
    data-aos-delay={delay * 150}
  >
    <Icon size={20} className="text-white" />
  </motion.a>
));

// Main HomePage component
export default function HomePage() {
  const [lottieHovered, setLottieHovered] = useState(false);

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('@/public/animations/profile-animation.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Tech stack items
  const techStack = [
    { icon: Code, name: 'JavaScript/TypeScript', delay: 1 },
    { icon: Monitor, name: 'React/Next.js', delay: 2 },
    { icon: Layers, name: 'Tailwind CSS', delay: 3 },
    { icon: Database, name: 'SQL/NoSQL', delay: 4 },
    { icon: Globe, name: 'REST/GraphQL', delay: 5 },
    { icon: Zap, name: 'Node.js/Express', delay: 6 },
  ];

  // Social links
  const socialLinks = [
    { icon: Github, href: 'https://github.com', delay: 1 },
    { icon: Linkedin, href: 'https://linkedin.com', delay: 2 },
    { icon: Twitter, href: 'https://twitter.com', delay: 3 },
  ];

  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Handle lottie hover
  const handleLottieHover = useCallback(() => {
    setLottieHovered(true);
  }, []);

  const handleLottieLeave = useCallback(() => {
    setLottieHovered(false);
  }, []);

  // Background elements for visual effect
  const BackgroundElements = memo(() => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute top-2/3 left-1/4 w-60 h-60 rounded-full bg-indigo-500/10 blur-[80px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
    </div>
  ));

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundElements />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 xl:px-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10"
            >
              <StatusBadge />
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <span className="text-white">Full Stack</span> 
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Developer
                </span>
              </motion.h1>
              
              <motion.div 
                className="text-lg md:text-xl text-white/70 mb-8 h-20"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <TypewriterComponent
                  options={{
                    strings: [
                      'Building modern web applications with React and Next.js',
                      'Creating beautiful user interfaces with Tailwind CSS',
                      'Developing robust backends with Node.js and databases',
                      'Passionate about clean code and great user experiences'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 40,
                    deleteSpeed: 20,
                  }}
                />
              </motion.div>
              
              {/* Call to Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
                      text-white font-medium flex items-center space-x-2 shadow-lg shadow-indigo-500/20
                      hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    <span>Projects</span>
                    <motion.span
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink size={18} />
                    </motion.span>
                  </motion.button>
                </Link>
                
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg border border-indigo-500/50
                      text-white font-medium flex items-center space-x-2 
                      hover:bg-indigo-500/10 transition-all duration-300"
                  >
                    <span>Contact</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Send size={18} />
                    </motion.span>
                  </motion.button>
                </Link>
              </motion.div>
              
              {/* Social Media Links */}
              <motion.div 
                className="flex space-x-4"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                {socialLinks.map((link, index) => (
                  <SocialLink 
                    key={index} 
                    icon={link.icon} 
                    href={link.href} 
                    delay={link.delay} 
                  />
                ))}
              </motion.div>
            </motion.div>
            
            {/* Lottie Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={handleLottieHover}
                onHoverEnd={handleLottieLeave}
                className="max-w-[400px] w-full"
              >
                <Lottie 
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={false}
                  isPaused={false}
                  style={{
                    opacity: lottieHovered ? 1 : 0.9,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Tech Stack Section */}
        <section className="relative py-20 px-6 md:px-12 lg:px-24 xl:px-32 max-w-7xl mx-auto">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500"
            data-aos="fade-up"
          >
            Tech Stack & Expertise
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <TechItem
                key={index}
                icon={tech.icon}
                name={tech.name}
                delay={tech.delay}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
} 