'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useCommunityStats } from '@/hooks/useCommunityStats';
import { useTestimonials } from '@/hooks/useTestimonials';

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

// Testimonial card component
const TestimonialCard = ({ name, role, text, avatarPlaceholder }: { name: string; role: string; text: string; avatarPlaceholder: string }) => (
  <motion.div
    variants={elementVariants}
    className="rounded-xl bg-[#0a0a29]/40 border border-indigo-500/10 p-6 hover:border-indigo-500/30 transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="rounded-full w-12 h-12 overflow-hidden bg-indigo-500/20 flex items-center justify-center mr-4">
        <span className="text-indigo-300 font-bold">{avatarPlaceholder}</span>
      </div>
      <div>
        <h3 className="text-white font-semibold">{name}</h3>
        <p className="text-indigo-300/70 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-white/70 italic">{text}</p>
  </motion.div>
);

// Community stat component
const CommunityStat = ({ count, label }: { count: string; label: string }) => (
  <motion.div
    variants={elementVariants}
    className="text-center p-4"
  >
    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
      {count}
    </div>
    <p className="text-white/50 text-sm">{label}</p>
  </motion.div>
);

export default function CommunitySection() {
  const { stats, loading: statsLoading, error: statsError } = useCommunityStats();
  const { testimonials, loading: testimonialsLoading, error: testimonialsError } = useTestimonials({ featured: true, limit: 6 });

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Section id="community" className="bg-transparent">
      <AnimatedHeading className="text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Komunitas
        </span> Saya
      </AnimatedHeading>
      
      <AnimatedParagraph className="text-center max-w-3xl mx-auto">
        Saya senang terhubung dengan orang lain dalam industri ini. Berikut adalah apa yang dikatakan orang-orang tentang kolaborasi dengan saya.
      </AnimatedParagraph>
      
      {/* Community Stats */}
      <motion.div 
        variants={elementVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 border-y border-indigo-500/10 py-12"
      >
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={elementVariants}
              className="text-center p-4 animate-pulse"
            >
              <div className="h-12 bg-indigo-500/20 rounded mb-2"></div>
              <div className="h-4 bg-indigo-500/10 rounded"></div>
            </motion.div>
          ))
        ) : statsError ? (
          <motion.div
            variants={elementVariants}
            className="col-span-full text-center text-red-400 p-4"
          >
            Error loading community stats
          </motion.div>
        ) : (
          stats?.map((stat) => (
            <CommunityStat 
              key={stat.id}
              count={stat.value} 
              label={stat.label} 
            />
          ))
        )}
      </motion.div>
      
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonialsLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              variants={elementVariants}
              className="rounded-xl bg-[#0a0a29]/40 border border-indigo-500/10 p-6 animate-pulse"
            >
              <div className="flex items-center mb-4">
                <div className="rounded-full w-12 h-12 bg-indigo-500/20 mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-indigo-500/20 rounded mb-2"></div>
                  <div className="h-3 bg-indigo-500/10 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-indigo-500/10 rounded"></div>
                <div className="h-3 bg-indigo-500/10 rounded"></div>
                <div className="h-3 bg-indigo-500/10 rounded w-3/4"></div>
              </div>
            </motion.div>
          ))
        ) : testimonialsError ? (
          <motion.div
            variants={elementVariants}
            className="col-span-full text-center text-red-400 p-6"
          >
            Error loading testimonials
          </motion.div>
        ) : testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
             <TestimonialCard 
               key={testimonial.id}
               name={testimonial.name}
               role={testimonial.role || 'Client'}
               text={testimonial.content}
               avatarPlaceholder={getInitials(testimonial.name)}
             />
           ))
        ) : (
          <motion.div
            variants={elementVariants}
            className="col-span-full text-center text-white/50 p-6"
          >
            No testimonials available
          </motion.div>
        )}
      </div>
    </Section>
  );
}