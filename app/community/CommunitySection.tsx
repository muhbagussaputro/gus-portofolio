'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
        <CommunityStat count="2,500+" label="Koneksi LinkedIn" />
        <CommunityStat count="15+" label="Proyek Open Source" />
        <CommunityStat count="20+" label="Klien Puas" />
        <CommunityStat count="5+" label="Tahun Pengalaman" />
      </motion.div>
      
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard 
          name="Ahmad Fajar"
          role="CTO, TechStars Indonesia"
          text="Bagus adalah pengembang yang luar biasa dengan pemahaman mendalam tentang React dan Next.js. Kemampuannya untuk memecahkan masalah kompleks dan menghasilkan solusi elegan sangat mengesankan."
          avatarPlaceholder="AF"
        />
        
        <TestimonialCard 
          name="Siti Amalia"
          role="Product Manager, InnovateID"
          text="Bekerja dengan Bagus selalu menjadi pengalaman yang menyenangkan. Dia tidak hanya memiliki keterampilan teknis yang hebat, tetapi juga pemahaman bisnis yang membantu proyek kami mencapai tujuannya."
          avatarPlaceholder="SA"
        />
        
        <TestimonialCard 
          name="Budi Santoso"
          role="Startup Founder, EdTech Nusantara"
          text="Bagus membantu kami mengubah visi menjadi realitas. Kode berkualitasnya dan komitmennya terhadap batas waktu membuat dia menjadi aset berharga untuk tim pengembangan manapun."
          avatarPlaceholder="BS"
        />
      </div>
    </Section>
  );
} 