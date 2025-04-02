'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, User, Github, Globe, ExternalLink, Terminal } from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';
import dynamic from 'next/dynamic';
import loadingAnimation from '@/public/animations/loading-animation.json';

// Dynamically import Lottie with ssr: false option
const Lottie = dynamic(() => import('react-lottie'), {
  ssr: false,
});

interface WelcomeScreenProps {
  onComplete: () => void;
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
          <span>welcome.tsx</span>
        </div>
      </div>
      
      <div className="h-[180px] overflow-hidden">
        <TypewriterComponent
          options={{
            strings: [
              `import React from 'react';\nimport { motion } from 'framer-motion';\n\nconst Welcome = () => {\n  return (\n    <motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      className="welcome-screen"\n    >\n      <h1>Welcome to My Portfolio</h1>\n      <p>Loading awesome content...</p>\n    </motion.div>\n  );\n};\n\nexport default Welcome;`,
            ],
            autoStart: true,
            loop: false,
            delay: 20,
            cursor: '|',
            wrapperClassName: 'code-wrapper',
          }}
        />
      </div>
    </motion.div>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  // State for animation and display control
  const [progress, setProgress] = useState(0);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [showCodeAnimation, setShowCodeAnimation] = useState(false);

  // Lottie animation configuration
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Effect to start loading process and show code animation
  useEffect(() => {
    // Start loading after welcome screen appears
    const loadingTimer = setTimeout(() => {
      setShowLoadingText(true);
      startLoadingProcess();
    }, 1000);
    
    // Show code animation after a delay
    const codeTimer = setTimeout(() => {
      setShowCodeAnimation(true);
    }, 2000);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(codeTimer);
    };
  }, []);

  // Function to start loading process
  const startLoadingProcess = () => {
    // Loading duration of 5 seconds
    const loadingDuration = 5000;
    
    // Incrementally increase progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + 1;
        
        // If 100%, clear interval and proceed to main page
        if (newValue >= 100) {
          clearInterval(interval);
          
          // Exit animation before onComplete
          setExitAnimation(true);
          setTimeout(() => {
            onComplete();
          }, 800);
          
          return 100;
        }
        return newValue;
      });
    }, loadingDuration / 100);
    
    return () => clearInterval(interval);
  };

  // Handle skip loading process
  const handleSkip = () => {
    setExitAnimation(true);
    setTimeout(() => {
      onComplete();
    }, 800);
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

  // Variants for icons
  const iconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: i * 0.15 + 0.1,
      }
    }),
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
    hover: { 
      scale: 1.2, 
      boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)",
      color: "#a855f7"
    }
  };

  // Split text for separate animations
  const welcomeText = "Welcome To".split(" ");
  const portfolioText = "My Portfolio".split(" ");

  return (
    <div className="fixed inset-0 z-50 bg-[#030014] overflow-hidden">
      <motion.div
        key="welcome-container"
        className="absolute inset-0 flex flex-col items-center justify-between"
        style={{ opacity: exitAnimation ? 0 : 1, scale: exitAnimation ? 0.95 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute top-2/3 left-1/4 w-60 h-60 rounded-full bg-indigo-500/20 blur-[80px]"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
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
                { icon: User, delay: 1, link: '#' },
                { icon: Github, delay: 2, link: '#' }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  variants={iconVariants}
                  custom={item.delay}
                  whileHover="hover"
                  className="p-4 rounded-full bg-[#0a0a29]/60 border border-indigo-500/20 flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <item.icon size={28} className="text-white/90" />
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
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400"
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
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"
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
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.2)" }}
                className="flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 hover:from-indigo-500/30 hover:to-purple-600/30 transition-all shadow-lg"
              >
                <Globe size={20} className="mr-3 text-indigo-300" />
                <span className="text-white/90 text-xl font-medium tracking-wide">
                  <TypewriterComponent
                    options={{
                      strings: ['https://muhbagussaputro.my.id'],
                      autoStart: true,
                      loop: false,
                      delay: 80,
                      cursor: '|',
                    }}
                  />
                </span>
                <ExternalLink size={16} className="ml-3 text-indigo-300" />
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
                    <span className="text-indigo-400 text-sm font-medium">
                      <TypewriterComponent
                        options={{
                          strings: ['Loading Portfolio...', 'Preparing Content...', 'Almost Done...'],
                          autoStart: true,
                          loop: true,
                          delay: 75,
                          deleteSpeed: 40,
                        }}
                      />
                    </span>
                  </div>
                  <span className="text-indigo-300/80 text-sm">{progress}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#0a0a29]/80 rounded-full overflow-hidden backdrop-blur-sm border border-indigo-500/10">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  />
                </div>
                
                {/* Skip Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: progress > 20 ? 1 : 0,
                    y: progress > 20 ? 0 : 10
                  }}
                  transition={{ duration: 0.4 }}
                  onClick={handleSkip}
                  className="self-end text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-300"
                >
                  Skip Loading →
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen; 