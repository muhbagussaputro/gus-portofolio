'use client';

import { motion } from 'framer-motion';
import { Code, Server, Database, Smartphone, Brush, Zap, LayoutGrid, Users, BrainCircuit, MessageSquare, Lightbulb, FileCode } from 'lucide-react';
import { ReactNode } from 'react';

interface SkillCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  className?: string;
}

const SkillCard = ({ title, description, icon, delay = 0, className = '' }: SkillCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className={`bg-gradient-to-br from-[#0a0a29] to-[#0f0f3c] p-6 rounded-xl border border-indigo-500/20 
        hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 
        ${className}`}
    >
      <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

export default function SkillCards() {
  const technicalSkills = [
    {
      title: "Web Development",
      description: "Next.js, JavaScript (ES6+), React.js, Responsive Design, UI/UX Principles",
      icon: <Code size={24} />
    },
    {
      title: "Mobile Development",
      description: "Android Development dengan Kotlin dan Java, Jetpack Compose, MVVM Architecture",
      icon: <Smartphone size={24} />
    },
    {
      title: "Back-End Development",
      description: "PHP Native, Laravel, RESTful API, dan pengelolaan database",
      icon: <Server size={24} />
    },
    {
      title: "Database Management",
      description: "SQL, MySQL, Firebase untuk aplikasi web dan mobile",
      icon: <Database size={24} />
    },
    {
      title: "UI/UX Design",
      description: "Prinsip UI/UX dan desain responsif untuk pengalaman pengguna yang optimal",
      icon: <LayoutGrid size={24} />
    },
    {
      title: "AI & Machine Learning",
      description: "TensorFlow Lite untuk aplikasi Android dan implementasi model machine learning",
      icon: <BrainCircuit size={24} />
    }
  ];
  
  const softSkills = [
    {
      title: "Kepemimpinan",
      description: "Mengelola tim dalam proyek pengembangan aplikasi dan dalam organisasi",
      icon: <Users size={24} />
    },
    {
      title: "Kerja Tim",
      description: "Berkolaborasi dengan pengembang, desainer, dan stakeholder dalam proyek",
      icon: <Users size={24} />
    },
    {
      title: "Pemecahan Masalah",
      description: "Menganalisis bug dan meningkatkan performa aplikasi secara efektif",
      icon: <Zap size={24} />
    },
    {
      title: "Komunikasi Efektif",
      description: "Menyampaikan ide teknis dengan jelas kepada tim dan klien",
      icon: <MessageSquare size={24} />
    },
    {
      title: "Berpikir Kreatif",
      description: "Mengembangkan solusi inovatif dalam pengembangan aplikasi",
      icon: <Lightbulb size={24} />
    },
    {
      title: "Inisiatif",
      description: "Proaktif dalam mencari solusi dan mengusulkan fitur baru dalam pengembangan",
      icon: <FileCode size={24} />
    }
  ];

  return (
    <div className="space-y-12">
      {/* Technical Skills */}
      <div>
        <h3 className="text-xl text-indigo-400 font-semibold mb-6">Keahlian Teknis (Hard Skills)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalSkills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
      
      {/* Soft Skills */}
      <div>
        <h3 className="text-xl text-indigo-400 font-semibold mb-6">Keahlian Non-Teknis (Soft Skills)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softSkills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 