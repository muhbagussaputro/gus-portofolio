'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

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

// Project card component (clickable demo/github)
const ProjectCard = ({
  title,
  description,
  tags,
  imageUrl,
  demoUrl,
  githubUrl,
}: {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
}) => (
  <motion.div
    variants={elementVariants}
    className="rounded-xl overflow-hidden bg-[#0a0a29]/40 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group"
  >
    {/* Thumbnail */}
    <div className="relative h-48 w-full overflow-hidden">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
          <span className="text-white/50 text-sm">Project Preview</span>
        </div>
      )}
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"
          aria-label={`Open demo of ${title}`}
        />
      )}
    </div>
    {/* Content */}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70 mb-4 text-sm leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 6).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500/40 text-white hover:bg-indigo-500/10 transition"
          >
            <ExternalLink size={16} /> Demo
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500/40 text-white/80 hover:bg-indigo-500/10 transition"
          >
            <Github size={16} /> GitHub
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

export default function PortfolioSection() {
  const { projects, loading } = useProjects({ featured: true, limit: 6 });
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
        {loading && (
          <div className="col-span-3 text-center text-white/60">Loading projects...</div>
        )}
        {!loading && projects.map((p: any) => (
          <ProjectCard
            key={p.slug}
            title={p.title}
            description={p.short_description || ''}
            tags={(p.technologies || []).map((t: any) => t?.technology?.name ?? t?.name).filter(Boolean)}
            imageUrl={p.thumbnail_url}
            demoUrl={p.demo_url}
            githubUrl={p.github_url}
          />
        ))}
      </div>
      
      <motion.div
        variants={elementVariants}
        className="mt-16 text-center"
      >
        <Link href="/portfolio" className="px-6 py-3 rounded-lg border border-indigo-500/50
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