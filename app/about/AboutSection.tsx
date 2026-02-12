'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Zap, Database, Server, Layers, Monitor, Smartphone, GraduationCap, Calendar } from 'lucide-react';
import SkillCards from '@/components/SkillCards';
import { useAbout, useProfile } from '@/hooks/useAbout';
import Image from 'next/image';

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

// Education/Experience Item Component
const TimelineItem = ({ title, subtitle, period, description, icon: Icon }: { 
  title: string; 
  subtitle: string; 
  period: string; 
  description: string; 
  icon: any 
}) => (
  <motion.div
    variants={elementVariants}
    className="flex gap-4 mb-6"
  >
    <div className="flex-shrink-0 mt-1">
      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
        <Icon size={20} />
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="text-indigo-400 font-medium mb-1">{subtitle}</div>
      <div className="text-gray-500 text-sm mb-2 flex items-center">
        <Calendar size={14} className="mr-1" />
        {period}
      </div>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

// Skill card component
const SkillCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div
    variants={elementVariants}
    className="p-6 rounded-xl bg-[#0a0a29]/50 border border-indigo-500/20 
      hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-lg bg-indigo-500/10 mr-4">
        <Icon size={24} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-white/70">{description}</p>
  </motion.div>
);

export default function AboutSection() {
  const { data } = useAbout();
  const { profile } = useProfile();
  return (
    <Section id="about" className="bg-transparent text-white">
      <div className="space-y-16">
        {/* Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimatedHeading>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Tentang Saya
              </span>
            </AnimatedHeading>
            
            <AnimatedParagraph>
              {profile?.summary || 'Full Stack Developer & Mobile Developer dengan pengalaman membangun aplikasi web dan mobile.'}
            </AnimatedParagraph>
          </div>
          
          <motion.div
            variants={elementVariants}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-xl"></div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/20 shadow-xl shadow-indigo-500/10">
               <Image
                src="/images/profil.jpg"
                alt={profile?.full_name || 'Profile'}
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Education Section */}
        <div>
          <motion.div
            variants={elementVariants}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Pendidikan
              </span>
            </h2>
          </motion.div>
          
          <div className="space-y-6">
            {data?.education?.map((edu) => (
              <TimelineItem
                key={edu.id}
                icon={GraduationCap}
                title={edu.institution}
                subtitle={[edu.degree, edu.field_of_study].filter(Boolean).join(' - ')}
                period={`${new Date(edu.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} - ${edu.end_date ? new Date(edu.end_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Present'}`}
                description={edu.description || ''}
              />
            ))}
          </div>
        </div>
        
        {/* Skills Section */}
        <div>
          <motion.div
            variants={elementVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Keahlian & Kemampuan
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Berikut adalah teknologi dan keterampilan yang saya kuasai selama menjalani karir sebagai developer.
            </p>
          </motion.div>
          
          <SkillCards />
        </div>
      </div>
    </Section>
  );
} 