'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Code, Zap, Database, Server, Layers, Monitor, Send, ExternalLink, ChevronDown, Github, Linkedin, Twitter, Flame, Smartphone, Mail } from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';
import ProfilePhoto from '@/app/(home)/ProfilePhoto';
import Link from 'next/link';

// Dynamically import Lottie dengan lottie-react yang modern
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

// Animation variants for section elements
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for individual elements
const elementVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
    },
  },
};

// Section component with animations using framer-motion's built-in useInView
const Section = ({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1
  });

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen py-20 px-6 md:px-12 lg:px-24 will-change-transform ${className || ''}`}
    >
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
};

// Animated heading component
const AnimatedHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.h2
    variants={elementVariants}
    className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 ${className || ''}`}
  >
    {children}
  </motion.h2>
);

// Animated paragraph component
const AnimatedParagraph = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.p
    variants={elementVariants}
    className={`text-white/70 text-lg mb-6 ${className || ''}`}
  >
    {children}
  </motion.p>
);

// Social link component
const SocialLink = ({ icon: Icon, href }: { icon: any; href: string }) => (
  <motion.a
    variants={elementVariants}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-[#0a0a29]/50 border border-indigo-500/20 
      hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
  >
    <Icon size={20} className="text-white" />
  </motion.a>
);

// Animated Tech Stack Component
const TechStack = () => {
  const technologies = [
    { name: 'Kotlin', icon: <Code size={18} /> },
    { name: 'React', icon: <Code size={18} /> },
    { name: 'Next.js', icon: <Server size={18} /> },
    { name: 'Laravel', icon: <Layers size={18} /> },
    { name: 'Android', icon: <Smartphone size={18} /> },
    { name: 'MySQL', icon: <Database size={18} /> },
  ];

  return (
    <motion.div
      variants={elementVariants}
      className="mb-8 flex flex-wrap gap-3"
    >
      {technologies.map((tech, index) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a29]/80 
            border border-indigo-500/20 text-xs md:text-sm text-indigo-300
            hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-colors"
        >
          {tech.icon}
          {tech.name}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function HeroSection() {
  const [lottieData, setLottieData] = useState<any>(null);
  const [lottieError, setLottieError] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lightningActive, setLightningActive] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);
  const debrisRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const glitchControls = useAnimation();

  // Load animation data after component mount
  useEffect(() => {
    import('@/public/animations/profile-animation.json')
      .then((data) => {
        setLottieData(data.default);
      })
      .catch((error) => {
        console.error("Failed to load animation:", error);
        setLottieError(true);
      });
      
    // Random glitch effect timing
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, Math.random() * 5000 + 3000);
    
    // Random lightning effect
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 100);
        
        // Sometimes double flash
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 80);
          }, 200);
        }
      }
    }, Math.random() * 10000 + 5000);
    
    // Track mouse movement for particle effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create fire particle at cursor position
      if (cursorTrailRef.current && Math.random() > 0.7) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 rounded-full bg-orange-500/70 pointer-events-none';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.filter = 'blur(1px)';
        
        cursorTrailRef.current.appendChild(particle);
        
        // Animate the particle
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        const startX = e.clientX;
        const startY = e.clientY;
        let opacity = 1;
        let size = Math.random() * 2 + 1;
        
        const animateParticle = () => {
          if (opacity <= 0.1 || size <= 0.2) {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
            return;
          }
          
          size -= 0.05;
          opacity -= 0.02;
          
          const x = parseFloat(particle.style.left) + Math.cos(angle) * speed;
          const y = parseFloat(particle.style.top) + Math.sin(angle) * speed - 1; // Rising effect
          
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.opacity = opacity.toString();
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          requestAnimationFrame(animateParticle);
        };
        
        requestAnimationFrame(animateParticle);
        
        // Remove particle after some time for cleanup
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 2000);
      }
    };
    
    // Create floating embers/ash particles
    const createEmbers = () => {
      if (particlesRef.current) {
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            if (!particlesRef.current) return;
            
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const isEmber = Math.random() > 0.7;
            
            particle.className = `absolute rounded-full pointer-events-none ${isEmber ? 'bg-orange-500' : 'bg-gray-300/20'}`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${window.innerHeight + 10}px`;
            particle.style.opacity = (Math.random() * 0.5 + 0.2).toString();
            
            if (isEmber) {
              particle.style.boxShadow = '0 0 4px 1px rgba(255, 100, 50, 0.4)';
              particle.style.filter = 'blur(0.5px)';
            } else {
              particle.style.filter = 'blur(1px)';
            }
            
            particlesRef.current.appendChild(particle);
            
            // Animate the ember/ash
            const speedX = (Math.random() - 0.5) * 1.5;
            const speedY = -(Math.random() * 2 + 1);
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            let wobblePhase = Math.random() * Math.PI * 2;
            const wobbleFrequency = Math.random() * 0.02 + 0.01;
            const wobbleAmplitude = Math.random() * 2 + 1;
            
            const animateParticle = () => {
              if (y < -20 || x < -20 || x > window.innerWidth + 20) {
                if (particle.parentNode) {
                  particle.parentNode.removeChild(particle);
                }
                return;
              }
              
              wobblePhase += wobbleFrequency;
              x += speedX + Math.sin(wobblePhase) * wobbleAmplitude;
              y += speedY;
              
              particle.style.left = `${x}px`;
              particle.style.top = `${y}px`;
              
              // Pulsating effect for embers
              if (isEmber && Math.random() > 0.9) {
                const currentOpacity = parseFloat(particle.style.opacity);
                particle.style.opacity = (currentOpacity * (Math.random() * 0.3 + 0.85)).toString();
              }
              
              requestAnimationFrame(animateParticle);
            };
            
            requestAnimationFrame(animateParticle);
            
            // Remove particle after some time to prevent memory leaks
            setTimeout(() => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            }, 10000);
          }, Math.random() * 2000);
        }
      }
    };
    
    // Start creating embers and repeat periodically
    createEmbers();
    const emberInterval = setInterval(createEmbers, 3000);
    
    // Create floating debris
    const createDebris = () => {
      if (debrisRef.current) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (!debrisRef.current) return;
            
            const debris = document.createElement('div');
            const size = Math.random() * 4 + 1;
            
            debris.className = 'absolute bg-gray-500/10 rounded-sm pointer-events-none';
            debris.style.width = `${size}px`;
            debris.style.height = `${size}px`;
            debris.style.left = `${Math.random() * window.innerWidth}px`;
            debris.style.top = `${window.innerHeight + 5}px`;
            debris.style.opacity = (Math.random() * 0.3 + 0.1).toString();
            debris.style.filter = 'blur(0.5px)';
            
            debrisRef.current.appendChild(debris);
            
            // Animate the debris
            const speedX = (Math.random() - 0.5) * 1;
            const speedY = -(Math.random() * 1.5 + 0.5);
            const rotationSpeed = (Math.random() - 0.5) * 2;
            let rotation = Math.random() * 360;
            let x = parseFloat(debris.style.left);
            let y = parseFloat(debris.style.top);
            
            const animateDebris = () => {
              if (y < -20 || x < -20 || x > window.innerWidth + 20) {
                if (debris.parentNode) {
                  debris.parentNode.removeChild(debris);
                }
                return;
              }
              
              x += speedX;
              y += speedY;
              rotation += rotationSpeed;
              
              debris.style.left = `${x}px`;
              debris.style.top = `${y}px`;
              debris.style.transform = `rotate(${rotation}deg)`;
              
              requestAnimationFrame(animateDebris);
            };
            
            requestAnimationFrame(animateDebris);
            
            // Remove debris after some time to prevent memory leaks
            setTimeout(() => {
              if (debris.parentNode) {
                debris.parentNode.removeChild(debris);
              }
            }, 15000);
          }, Math.random() * 2000);
        }
      }
    };
    
    // Start creating debris and repeat periodically
    createDebris();
    const debrisInterval = setInterval(createDebris, 4000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(lightningInterval);
      clearInterval(emberInterval);
      clearInterval(debrisInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative text-white">
      {/* Cursor trail container */}
      <div 
        ref={cursorTrailRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-20"
      ></div>
      
      {/* Flying embers particles container */}
      <div 
        ref={particlesRef} 
        className="fixed inset-0 overflow-hidden pointer-events-none z-10"
      ></div>
      
      {/* Floating debris/ash container */}
      <div 
        ref={debrisRef} 
        className="fixed inset-0 overflow-hidden pointer-events-none z-10"
      ></div>
      
      {/* Lightning flash effect */}
      <AnimatePresence>
        {lightningActive && (
          <motion.div 
            className="fixed inset-0 bg-white/30 z-20 pointer-events-none mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <Section id="home" className="flex items-center relative">
        {/* Background Elements */}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            {/* Status Badge */}
            <motion.div
              variants={elementVariants}
              className="inline-flex items-center px-3 py-1 rounded-full 
                bg-gradient-to-r from-indigo-500/10 to-purple-600/10
                border border-indigo-500/20 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-indigo-300 text-sm font-medium">Available for Projects</span>
            </motion.div>
            
            <AnimatedHeading>
              <span className="text-white">MUH BAGUS</span> 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                SAPUTRO
              </span>
            </AnimatedHeading>
            
            <motion.div 
              variants={elementVariants}
              className="text-lg md:text-xl text-white/70 mb-8 h-20"
            >
              <TypewriterComponent
                options={{
                  strings: [
                    'Full Stack Developer & Mobile Developer',
                    'Android Development with Kotlin and Java',
                    'Web Development with React and Next.js',
                    'Laravel and PHP Development'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 40,
                  deleteSpeed: 20,
                }}
              />
            </motion.div>
            
            {/* Tech Stack Section */}
            <TechStack />
            
            {/* Call To Action Button */}
            <motion.div
              variants={elementVariants}
              className="mb-8"
            >
              <Link 
                href="#portfolio" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                  text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 
                  hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30
                  transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                Lihat Portofolio
                <ExternalLink size={16} />
              </Link>
            </motion.div>
            
            {/* Social Media Links */}
            <motion.div 
              variants={elementVariants}
              className="flex space-x-4"
            >
              <SocialLink icon={Github} href="https://github.com/BagusCPaste/" />
              <SocialLink icon={Linkedin} href="https://linkedin.com/in/gusaja" />
              <SocialLink icon={Mail} href="mailto:muhbagussaputro.id@gmail.com" />
            </motion.div>
          </div>
          
          {/* Lottie Animation - updated */}
          <motion.div
            variants={elementVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0">
                {lottieData && !lottieError && (
                  <Lottie 
                    animationData={lottieData}
                    loop={true}
                    style={{ height: 400, width: 400 }}
                  />
                )}
              </div>
              <ProfilePhoto imageUrl="/images/profil.jpg" size={300} />
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-indigo-300 text-sm mb-2">Scroll Down</span>
          <ChevronDown className="text-indigo-300" size={20} />
        </motion.div>
      </Section>
    </div>
  );
} 