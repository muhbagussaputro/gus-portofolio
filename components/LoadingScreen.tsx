'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, User, Github, Globe, ExternalLink, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useNavbarVisibility } from './NavbarVisibilityContext';

// Dynamically import TypewriterComponent to avoid SSR issues
const TypewriterComponent = dynamic(() => import('typewriter-effect'), {
  ssr: false,
  loading: () => <span className="loading-placeholder">Loading...</span>
});

interface LoadingScreenProps {
  minimumLoadTimeMs?: number;
}

// Code animation component
const CodeAnimation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="bg-[#0a0a29]/80 rounded-lg border border-indigo-500/20 p-4 font-mono text-sm text-indigo-300 max-w-lg w-full mx-auto overflow-hidden"
    >
      <div className="flex items-center mb-2 border-b border-indigo-500/10 pb-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center ml-3 text-xs text-indigo-400/70">
          <Terminal size={12} className="mr-1.5" />
          <span>portfolio.tsx</span>
        </div>
      </div>
      
      <div className="h-[180px] overflow-hidden">
        <TypewriterComponent
          options={{
            strings: [
              `import { motion } from 'framer-motion';\nimport React from 'react';\n\nconst Portfolio: React.FC = () => {\n  return (\n    <motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      className="portfolio-container"\n    >\n      <h1>Hello, I'm Muh Bagus Saputro</h1>\n      <p>Full Stack Developer</p>\n    </motion.div>\n  );\n};\n\nexport default Portfolio;`,
            ],
            autoStart: true,
            loop: false,
            delay: 20,
            cursor: '|',
          }}
        />
      </div>
    </motion.div>
  );
};

export default function LoadingScreen({ minimumLoadTimeMs = 5000 }: LoadingScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { setNavbarVisible } = useNavbarVisibility();
  const [loading, setLoading] = useState(true);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [showCodeAnimation, setShowCodeAnimation] = useState(false);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Create particles for background
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 6 + 2;
        const opacity = Math.random() * 0.5 + 0.1;
        const animationDuration = Math.random() * 20 + 10;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        
        newParticles.push(
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              left: `${xPos}%`,
              top: `${yPos}%`,
            }}
            animate={{
              y: [0, -20, 20, 0],
              x: [0, 15, -15, 0],
              opacity: [opacity, opacity + 0.2, opacity - 0.1, opacity],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      }
      setParticles(newParticles);
    };
    
    createParticles();
  }, []);

  // Effect to start loading process and show code animation
  useEffect(() => {
    // Start loading after welcome screen appears
    const loadingTimer = setTimeout(() => {
      setShowLoadingText(true);
    }, 300);
    
    // Show code animation after a delay
    const codeTimer = setTimeout(() => {
      setShowCodeAnimation(true);
    }, 800);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(codeTimer);
    };
  }, []);

  // Handle progress update
  useEffect(() => {
    if (!loading) return;
    
    const startTime = Date.now();
    let animationFrame: number;
    
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      setTimeElapsed(elapsedTime);
      const newProgress = Math.min(100, (elapsedTime / minimumLoadTimeMs) * 100);
      
      // Cubic easing for smooth progress
      const easeProgress = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      setLoadingProgress(easeProgress(newProgress / 100) * 100);
      
      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        // Loading complete
        setLoading(false);
      }
    };
    
    animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [loading, minimumLoadTimeMs]);

  useEffect(() => {
    // Sembunyikan navbar saat loading screen ditampilkan
    setNavbarVisible(false);
    
    // Ketika loading selesai
    if (loadingProgress >= 100 && timeElapsed >= minimumLoadTimeMs) {
      setTimeout(() => {
        setIsVisible(false);
        // Tampilkan navbar setelah loading screen hilang
        setNavbarVisible(true);
      }, 800);
    }
  }, [loadingProgress, timeElapsed, minimumLoadTimeMs, setNavbarVisible]);

  // Handle skip loading
  const handleSkip = () => {
    setLoading(false);
  };

  // Animation variants for welcome
  const welcomeVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      } 
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.6
      }
    }
  };

  // Animation variants for loading
  const loadingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      } 
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.6
      }
    }
  };

  // Animation variants for child elements
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Animation variants for text
  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.5
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };

  // Split text for separate animations
  const welcomeText = "Welcome To".split(" ");
  const portfolioText = "My Universe".split(" ");

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.7,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          }}
          className="fixed inset-0 z-[9999] overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#050329] to-[#0a0442]">
            {/* Particle effect overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {particles}
            </div>
            
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px]"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute bottom-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-600/20 blur-[100px]"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              />
              <motion.div 
                className="absolute top-2/3 left-1/4 w-[20vw] h-[20vw] rounded-full bg-blue-500/20 blur-[80px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
            {/* Welcome Content */}
            <motion.div 
              className="w-full max-w-4xl flex flex-col items-center px-6 md:px-10 pt-20"
              variants={welcomeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Icons */}
              <motion.div className="flex gap-8 md:gap-12 mb-8 md:mb-12">
                {[
                  { icon: Code2, delay: 0, link: '#' },
                  { icon: User, delay: 1, link: '#about' },
                  { icon: Github, delay: 2, link: 'https://github.com/baguscodestudio' }
                ].map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.15 + 0.1,
                      }
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)"
                    }}
                    className="p-4 rounded-xl bg-[#0a0a29]/60 border border-indigo-500/20 flex items-center justify-center shadow-lg"
                  >
                    <item.icon size={22} className="text-white/90" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Welcome Text */}
              <motion.div className="text-center mb-6" variants={itemVariants}>
                <div className="flex flex-wrap justify-center mb-2 gap-x-4">
                  {welcomeText.map((word, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={textVariants}
                      className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-indigo-200 drop-shadow-lg"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-x-4">
                  {portfolioText.map((word, index) => (
                    <motion.span
                      key={index}
                      custom={index + welcomeText.length}
                      variants={textVariants}
                      className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 drop-shadow-lg"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Code Animation */}
              <AnimatePresence>
                {showCodeAnimation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg mb-8"
                  >
                    <CodeAnimation />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Website link */}
              <motion.div
                variants={itemVariants}
                className="relative mb-8"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)"
                  }}
                  className="flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow-lg"
                >
                  <Globe size={18} className="mr-3 text-indigo-300" />
                  <span className="text-indigo-300 font-mono text-sm">
                    <TypewriterComponent
                      options={{
                        strings: ['https://bagusportfolio.com'],
                        autoStart: true,
                        loop: false,
                        delay: 50,
                      }}
                    />
                  </span>
                  <ExternalLink size={14} className="ml-3 text-indigo-300" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Loading Bar at Bottom */}
            <motion.div
              className="w-full max-w-3xl px-6 pb-12 z-20"
              variants={loadingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {showLoadingText && (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-indigo-300 text-sm font-medium">
                        <TypewriterComponent
                          options={{
                            strings: ['Creating Experience...', 'Loading Universe...', 'Initializing Portfolio...'],
                            autoStart: true,
                            loop: true,
                            delay: 50,
                            deleteSpeed: 30,
                          }}
                        />
                      </span>
                    </div>
                    <span className="text-indigo-300 font-mono text-sm">{Math.floor(loadingProgress)}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-black/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${loadingProgress}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full relative"
                      style={{ 
                        filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))"
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-0 right-0 bottom-0 bg-white/30"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: 'easeInOut',
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Skip Button */}
                  {loadingProgress > 20 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        y: 0
                      }}
                      transition={{ duration: 0.4 }}
                      onClick={handleSkip}
                      className="self-end flex items-center text-xs text-white/70 hover:text-white/90 transition-all duration-300 mt-4 py-2 px-3 rounded-lg border border-white/5 bg-white/[0.02]"
                    >
                      Skip Intro
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 ml-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 