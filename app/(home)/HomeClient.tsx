'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Code, Zap, Database, Server, Layers, Monitor, Send, ExternalLink, ChevronDown, Github, Linkedin, Twitter, Flame } from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';
import ProfilePhoto from '@/app/(home)/ProfilePhoto';

// Dynamically import Lottie with ssr: false option
const Lottie = dynamic(() => import('react-lottie'), {
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
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen py-20 px-6 md:px-12 lg:px-24 ${className || ''}`}
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

// Tech stack item component
const TechItem = ({ icon: Icon, name }: { icon: any; name: string }) => (
  <motion.div
    variants={elementVariants}
    className="flex items-center p-4 rounded-lg bg-[#0a0a29]/40 border border-indigo-500/10 
      hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
  >
    <Icon size={20} className="text-indigo-400 mr-3" />
    <span className="text-white/80">{name}</span>
  </motion.div>
);

// Project card component
const ProjectCard = ({ title, description, tags, image }: { title: string; description: string; tags: string[]; image: string }) => (
  <motion.div
    variants={elementVariants}
    className="rounded-xl overflow-hidden bg-[#0a0a29]/40 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
  >
    <div className="h-48 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
      <span className="text-white/50 text-sm">{image}</span>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/60 mb-4 text-sm">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
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

export default function HomeClient() {
  const [lottieData, setLottieData] = useState<any>(null);
  const [lottieError, setLottieError] = useState(false);
  const [videoError, setVideoError] = useState(false);
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
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(lightningInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Create particles effect for fire embers
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 2;
      const speedX = Math.random() * 2 - 1;
      const speedY = Math.random() * -3 - 1;
      const rotation = Math.random() * 360;
      const lifetime = Math.random() * 2000 + 1000;
      
      particle.className = 'absolute rounded-full bg-orange-500';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.boxShadow = '0 0 10px 2px rgba(255, 160, 10, 0.8)';
      particle.style.opacity = '0.8';
      particle.style.transform = `rotate(${rotation}deg)`;
      
      // Random starting position near bottom of screen
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 5;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      particlesRef.current?.appendChild(particle);
      
      let posX = startX;
      let posY = startY;
      let opacity = 0.8;
      let scale = 1;
      
      const animateParticle = () => {
        posX += speedX;
        posY += speedY;
        opacity -= 0.003;
        scale -= 0.001;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = `${opacity}`;
        particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        if (opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animateParticle);
      
      setTimeout(() => {
        particle.remove();
      }, lifetime);
    };
    
    // Create particles at regular intervals
    const particleInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createParticle();
      }
    }, 100);
    
    return () => clearInterval(particleInterval);
  }, []);
  
  // Create floating debris/ash effect
  useEffect(() => {
    if (!debrisRef.current) return;
    
    const createDebris = () => {
      const debris = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const speedX = (Math.random() - 0.5) * 0.8;
      const speedY = Math.random() * -0.5 - 0.1;
      const rotationSpeed = (Math.random() - 0.5) * 2;
      const lifetime = Math.random() * 15000 + 10000;
      
      const opacity = Math.random() * 0.4 + 0.1;
      const grayscale = Math.floor(Math.random() * 30) + 50;
      
      debris.className = 'absolute rounded-sm';
      debris.style.width = `${size}px`;
      debris.style.height = `${size}px`;
      debris.style.backgroundColor = `rgb(${grayscale}, ${grayscale}, ${grayscale})`;
      debris.style.opacity = opacity.toString();
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 10;
      
      debris.style.left = `${startX}px`;
      debris.style.top = `${startY}px`;
      
      debrisRef.current?.appendChild(debris);
      
      let posX = startX;
      let posY = startY;
      let rotation = 0;
      
      const animateDebris = () => {
        posX += speedX;
        posY += speedY;
        rotation += rotationSpeed;
        
        debris.style.left = `${posX}px`;
        debris.style.top = `${posY}px`;
        debris.style.transform = `rotate(${rotation}deg)`;
        
        if (posY > -20) {
          requestAnimationFrame(animateDebris);
        } else {
          debris.remove();
        }
      };
      
      requestAnimationFrame(animateDebris);
      
      setTimeout(() => {
        debris.remove();
      }, lifetime);
    };
    
    // Create debris at regular intervals
    const debrisInterval = setInterval(() => {
      for (let i = 0; i < 2; i++) {
        createDebris();
      }
    }, 300);
    
    return () => clearInterval(debrisInterval);
  }, []);
  
  // Glitch effect animation
  useEffect(() => {
    if (glitchActive) {
      glitchControls.start({
        x: [0, -10, 5, -5, 0],
        opacity: [1, 0.8, 0.9, 0.7, 1],
        transition: { duration: 0.2 }
      });
    }
  }, [glitchActive, glitchControls]);

  // Updated animation options with loaded data
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Animated scroll to section with error handling
  const scrollToSection = (id: string) => {
    try {
      const element = document.getElementById(id);
      if (element) {
        // Calculate position with offset for navbar (approximately 90px)
        const navHeight = 90;
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        // Smooth scroll to section with offset
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error("Error scrolling to section:", error);
    }
  };

  // Handle click event for lightning effect 
  const handleClickEffect = () => {
    setLightningActive(true);
    setTimeout(() => setLightningActive(false), 100);
    
    // Create click shockwave/ripple effect
    if (particlesRef.current) {
      const ripple = document.createElement('div');
      const size = 300; // final size
      
      ripple.className = 'absolute rounded-full border border-indigo-500/30 z-50 pointer-events-none';
      ripple.style.left = `${mousePosition.x - size/2}px`;
      ripple.style.top = `${mousePosition.y - size/2}px`;
      ripple.style.width = '0px';
      ripple.style.height = '0px';
      ripple.style.borderWidth = '1px';
      ripple.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
      
      particlesRef.current.appendChild(ripple);
      
      let scale = 0;
      let opacity = 0.8;
      
      const animateRipple = () => {
        scale += 0.05;
        opacity -= 0.02;
        
        ripple.style.width = `${size * scale}px`;
        ripple.style.height = `${size * scale}px`;
        ripple.style.left = `${mousePosition.x - (size * scale)/2}px`;
        ripple.style.top = `${mousePosition.y - (size * scale)/2}px`;
        ripple.style.opacity = `${opacity}`;
        
        if (scale < 1 && opacity > 0) {
          requestAnimationFrame(animateRipple);
        } else {
          ripple.remove();
        }
      };
      
      requestAnimationFrame(animateRipple);
    }
    
    // Create more particles on click
    if (particlesRef.current) {
      for (let i = 0; i < 10; i++) {
        createParticle(mousePosition.x, mousePosition.y);
      }
    }
  };
  
  // Create custom particle for click effect
  const createParticle = (x: number, y: number) => {
    if (!particlesRef.current) return;
    
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 2;
    const angle = Math.random() * Math.PI * 2;
    const initialSpeed = Math.random() * 5 + 3;
    let speedX = Math.cos(angle) * initialSpeed;
    let speedY = Math.sin(angle) * initialSpeed;
    const rotation = Math.random() * 360;
    const lifetime = Math.random() * 1000 + 500;
    
    const hue = Math.floor(Math.random() * 30) + 20; // Orange-red hues
    
    particle.className = 'absolute rounded-full';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
    particle.style.boxShadow = `0 0 6px 2px hsla(${hue}, 100%, 60%, 0.6)`;
    particle.style.opacity = '0.8';
    particle.style.transform = `rotate(${rotation}deg)`;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    particlesRef.current.appendChild(particle);
    
    let posX = x;
    let posY = y;
    let opacity = 0.8;
    
    const animateParticle = () => {
      posX += speedX;
      posY += speedY;
      speedX *= 0.98;
      speedY *= 0.98;
      speedY += 0.1; // Gravity
      opacity -= 0.01;
      
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = `${opacity}`;
      
      if (opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };
    
    requestAnimationFrame(animateParticle);
    
    setTimeout(() => {
      particle.remove();
    }, lifetime);
  };
  
  // Create cursor trail effect
  useEffect(() => {
    if (!cursorTrailRef.current) return;
    
    const createTrailElement = (x: number, y: number) => {
      const trail = document.createElement('div');
      const size = Math.random() * 5 + 2;
      
      trail.className = 'absolute rounded-full pointer-events-none';
      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.backgroundColor = 'rgba(255, 100, 50, 0.7)';
      trail.style.boxShadow = '0 0 4px 1px rgba(255, 100, 50, 0.3)';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      
      cursorTrailRef.current?.appendChild(trail);
      
      let opacity = 0.7;
      
      const fade = () => {
        opacity -= 0.05;
        trail.style.opacity = opacity.toString();
        
        if (opacity > 0) {
          requestAnimationFrame(fade);
        } else {
          trail.remove();
        }
      };
      
      setTimeout(fade, 100);
      
      setTimeout(() => {
        trail.remove();
      }, 1000);
    };
    
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    
    const handleMouseMoveTrail = (e: MouseEvent) => {
      const currentTime = Date.now();
      
      // Only create trail element if enough time has passed
      if (currentTime - lastTime > 30) {
        createTrailElement(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = currentTime;
      }
    };
    
    const handleClickTrail = () => {
      handleClickEffect();
    };
    
    window.addEventListener('mousemove', handleMouseMoveTrail);
    window.addEventListener('click', handleClickTrail);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveTrail);
      window.removeEventListener('click', handleClickTrail);
    };
  }, [mousePosition]);

  return (
    <div className="bg-[#030014] text-white relative">
      {/* Background Apocalypse Video */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <motion.div 
          animate={glitchControls}
          className={`absolute inset-0 ${glitchActive ? 'after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-red-500/10 after:mix-blend-overlay' : ''}`}
        >
          {!videoError ? (
            <video
              className="absolute min-w-full min-h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
            >
              <source src="\videos\firestars.mp4" type="video/mp4" />
              {/* Fallback jika browser tidak mendukung video */}
              Maaf, browser Anda tidak mendukung tag video.
            </video>
          ) : (
            <div className="absolute inset-0 bg-[#030014]"></div>
          )}
        </motion.div>
        
        {/* Lightning flash effect */}
        <AnimatePresence>
          {lightningActive && (
            <motion.div 
              className="absolute inset-0 bg-white/30 z-20 pointer-events-none mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>
        
        {/* Watermark cover - creative element in corner */}
        <div className="absolute bottom-0 right-0 w-36 h-28 overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#030014] via-[#030014]/90 to-transparent"></div>
          <div className="absolute bottom-4 right-4 flex flex-col items-end">
            <Flame size={24} className="text-orange-500 animate-pulse" />
            <span className="text-xs text-orange-300 font-mono mt-1">APOCALYPSE_SYS</span>
          </div>
        </div>
        
        {/* Overlay gelap agar konten tetap terlihat jelas */}
        <div className="absolute inset-0 bg-[#030014] opacity-80"></div>
        
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay" 
          style={{ 
            background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))',
            backgroundSize: '100% 2px, 100% 100%'
          }}
        ></div>
        
        {/* Flying embers particles container */}
        <div 
          ref={particlesRef} 
          className="absolute inset-0 overflow-hidden pointer-events-none z-10"
        ></div>
        
        {/* Cursor trail container */}
        <div 
          ref={cursorTrailRef}
          className="absolute inset-0 overflow-hidden pointer-events-none z-20"
        ></div>
        
        {/* Floating debris/ash container */}
        <div 
          ref={debrisRef} 
          className="absolute inset-0 overflow-hidden pointer-events-none z-10"
        ></div>
        
        {/* Vignette effect at edges */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-70" 
          style={{ 
            background: 'radial-gradient(circle, rgba(3,0,20,0) 40%, rgba(3,0,20,1) 100%)',
          }}
        ></div>
      </div>

      {/* Konten website dengan z-index lebih tinggi */}
      <div className="relative z-10">
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
                <span className="text-indigo-300 text-sm font-medium">Ready to Innovate</span>
              </motion.div>
              
              <AnimatedHeading>
                <span className="text-white">Full Stack</span> 
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Developer
                </span>
              </AnimatedHeading>
              
              <motion.div 
                variants={elementVariants}
                className="text-lg md:text-xl text-white/70 mb-8 h-20"
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
              <div className="flex flex-wrap gap-4 mb-10">
                <motion.button
                  variants={elementVariants}
                  onClick={() => scrollToSection('portfolio')}
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
                
                <motion.button
                  variants={elementVariants}
                  onClick={() => scrollToSection('contact')}
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
              </div>
              
              {/* Social Media Links */}
              <motion.div 
                variants={elementVariants}
                className="flex space-x-4"
              >
                <SocialLink icon={Github} href="https://github.com/muhbagussaputro" />
                <SocialLink icon={Linkedin} href="https://linkedin.com/gusaja" />
                <SocialLink icon={Twitter} href="https://twitter.com/muhbagussaputro" />
              </motion.div>
            </div>
            
            {/* Lottie Animation */}
            <motion.div
              variants={elementVariants}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0">
                  {lottieData && !lottieError && (
                    <Lottie 
                      options={lottieOptions}
                      height={400}
                      width={400}
                      isStopped={false}
                      isPaused={false}
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

        {/* About Section */}
        <Section id="about" className="bg-[#020010]/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={elementVariants} className="order-2 lg:order-1">
              <div className="relative">
                <div className="w-full h-80 md:h-96 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-xl border border-indigo-500/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-indigo-300/50">Profile Image</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl border border-indigo-500/20"></div>
              </div>
            </motion.div>

            <div className="order-1 lg:order-2">
              <AnimatedHeading>
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Me</span>
              </AnimatedHeading>
              
              <AnimatedParagraph>
                I'm a passionate Full Stack Developer with expertise in modern web technologies. My journey in software development started 5 years ago, and I've been crafting digital experiences ever since.
              </AnimatedParagraph>
              
              <AnimatedParagraph>
                I specialize in building responsive, user-friendly applications with React and Next.js on the frontend, coupled with robust backend solutions using Node.js and various database technologies.
              </AnimatedParagraph>
              
              <AnimatedParagraph>
                My approach to development is centered around creating clean, maintainable code that delivers exceptional user experiences. I'm constantly learning and adapting to new technologies to stay at the forefront of web development.
              </AnimatedParagraph>
              
              <motion.div
                variants={elementVariants}
                className="mt-8 flex flex-wrap gap-4"
              >
                <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Problem Solver
                </span>
                <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Creative Thinker
                </span>
                <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Detail Oriented
                </span>
              </motion.div>
            </div>
          </div>

          {/* Tech Stack */}
          <motion.div className="mt-24">
            <AnimatedHeading className="text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Tech Stack
              </span>
            </AnimatedHeading>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              <TechItem icon={Code} name="JavaScript/TypeScript" />
              <TechItem icon={Monitor} name="React/Next.js" />
              <TechItem icon={Layers} name="Tailwind CSS" />
              <TechItem icon={Database} name="SQL/NoSQL" />
              <TechItem icon={Server} name="Node.js/Express" />
              <TechItem icon={Zap} name="REST/GraphQL APIs" />
            </div>
          </motion.div>
        </Section>

        {/* Portfolio Section */}
        <Section id="portfolio">
          <AnimatedHeading className="text-center">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Projects</span>
          </AnimatedHeading>
          
          <AnimatedParagraph className="text-center max-w-3xl mx-auto mb-16">
            Here are some of my recent projects showcasing my skills and experience in web development.
            Each project represents a unique challenge and demonstrates different aspects of my technical abilities.
          </AnimatedParagraph>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="E-Commerce Platform"
              description="A modern e-commerce solution with integrated payment processing and inventory management."
              tags={["Next.js", "Stripe", "MongoDB", "Tailwind CSS"]}
              image="E-Commerce Preview"
            />
            
            <ProjectCard 
              title="Social Media Dashboard"
              description="Analytics dashboard for tracking engagement metrics across various social media platforms."
              tags={["React", "D3.js", "Express", "Material UI"]}
              image="Dashboard Preview"
            />
            
            <ProjectCard 
              title="Real-time Chat Application"
              description="Secure messaging platform with end-to-end encryption and file sharing capabilities."
              tags={["Socket.io", "Node.js", "Firebase", "React"]}
              image="Chat App Preview"
            />
          </div>
          
          <motion.div
            variants={elementVariants}
            className="mt-16 text-center"
          >
            <Link href="#" className="px-6 py-3 rounded-lg border border-indigo-500/50
              text-white font-medium inline-flex items-center space-x-2 
              hover:bg-indigo-500/10 transition-all duration-300"
            >
              <span>View More Projects</span>
              <ExternalLink size={18} />
            </Link>
          </motion.div>
        </Section>

        {/* Community Section */}
        <Section id="komunitas" className="bg-[#020010]/40">
          <AnimatedHeading className="text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Community</span> Engagement
          </AnimatedHeading>
          
          <AnimatedParagraph className="text-center max-w-3xl mx-auto mb-16">
            I'm actively involved in the developer community, sharing knowledge and collaborating with other professionals.
            Here are some of my community contributions and engagements.
          </AnimatedParagraph>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={elementVariants}
              className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                <Code size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Open Source</h3>
              <p className="text-white/60">
                Contributing to open-source projects and maintaining several libraries used by developers worldwide.
              </p>
            </motion.div>
            
            <motion.div
              variants={elementVariants}
              className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                <Monitor size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tech Talks</h3>
              <p className="text-white/60">
                Speaking at conferences and meetups about web development, sharing insights and best practices.
              </p>
            </motion.div>
            
            <motion.div
              variants={elementVariants}
              className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                <Layers size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mentorship</h3>
              <p className="text-white/60">
                Mentoring junior developers and guiding them in their career journey through personalized training.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <AnimatedHeading>
                Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Connect</span>
              </AnimatedHeading>
              
              <AnimatedParagraph>
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                Feel free to reach out to me using the contact form or through social media.
              </AnimatedParagraph>
              
              <div className="space-y-4 mt-8">
                <motion.div
                  variants={elementVariants}
                  className="flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                    <Send size={18} className="text-indigo-400" />
                  </div>
                  <span className="text-white/80">contact@example.com</span>
                </motion.div>
                
                <motion.div
                  variants={elementVariants}
                  className="flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                    <Github size={18} className="text-indigo-400" />
                  </div>
                  <span className="text-white/80">github.com/username</span>
                </motion.div>
                
                <motion.div
                  variants={elementVariants}
                  className="flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                    <Linkedin size={18} className="text-indigo-400" />
                  </div>
                  <span className="text-white/80">linkedin.com/in/username</span>
                </motion.div>
              </div>
            </div>
            
            <motion.div
              variants={elementVariants}
              className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-6">Send Message</h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a29]/60 border border-indigo-500/20 text-white focus:border-indigo-500/50 focus:outline-none transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a29]/60 border border-indigo-500/20 text-white focus:border-indigo-500/50 focus:outline-none transition-colors duration-300"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a29]/60 border border-indigo-500/20 text-white focus:border-indigo-500/50 focus:outline-none transition-colors duration-300"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
                    text-white font-medium flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20
                    hover:shadow-indigo-500/40 transition-all duration-300"
                >
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </Section>
      </div>
    </div>
  );
} 