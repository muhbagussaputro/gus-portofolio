'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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

export default function PortfolioSection() {
  return (
    <Section id="portfolio" className="bg-transparent">
      <AnimatedHeading className="text-center">
        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Projects</span>
      </AnimatedHeading>
      
      <AnimatedParagraph className="text-center max-w-3xl mx-auto mb-16">
        Berikut adalah beberapa proyek terbaru saya yang menunjukkan keterampilan dan pengalaman saya dalam pengembangan web.
        Setiap proyek mewakili tantangan unik dan mendemonstrasikan aspek berbeda dari kemampuan teknis saya.
      </AnimatedParagraph>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard 
          title="E-Commerce Platform"
          description="Solusi e-commerce modern dengan pemrosesan pembayaran terintegrasi dan manajemen inventaris."
          tags={["Next.js", "Stripe", "MongoDB", "Tailwind CSS"]}
          image="E-Commerce Preview"
        />
        
        <ProjectCard 
          title="Social Media Dashboard"
          description="Dashboard analitik untuk melacak metrik engagement di berbagai platform media sosial."
          tags={["React", "D3.js", "Express", "Material UI"]}
          image="Dashboard Preview"
        />
        
        <ProjectCard 
          title="Real-time Chat Application"
          description="Platform perpesanan aman dengan enkripsi end-to-end dan kemampuan berbagi file."
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
          <span>Lihat Lebih Banyak Proyek</span>
          <ExternalLink size={18} />
        </Link>
      </motion.div>
    </Section>
  );
} 