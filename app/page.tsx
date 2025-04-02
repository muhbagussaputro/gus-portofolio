'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Code, Zap, Database, Server, Layers, Monitor, Send, ExternalLink, ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';

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

export default function Home() {
  const [lottieData, setLottieData] = useState<any>(null);

  // Load animation data after component mount
  useEffect(() => {
    import('@/public/animations/profile-animation.json')
      .then((data) => {
        setLottieData(data.default);
      })
      .catch((error) => {
        console.error("Failed to load animation:", error);
      });
  }, []);

  // Updated animation options with loaded data
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Animated scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="bg-[#030014] text-white">
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
                <SocialLink icon={Github} href="https://github.com" />
                <SocialLink icon={Linkedin} href="https://linkedin.com" />
                <SocialLink icon={Twitter} href="https://twitter.com" />
              </motion.div>
            </div>
            
            {/* Lottie Animation */}
            <motion.div
              variants={elementVariants}
              className="flex justify-center lg:justify-end"
            >
              <div className="max-w-md w-full">
                {lottieData && (
                  <Lottie 
                    options={lottieOptions}
                    height={400}
                    width={400}
                    isStopped={false}
                    isPaused={false}
                  />
                )}
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
        <Section id="about" className="bg-[#020010]">
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
        <Section id="komunitas" className="bg-[#020010]">
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
    </Layout>
  );
}
