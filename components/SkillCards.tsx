'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useSkills } from '@/hooks/useAbout';
import { Monitor, Server, Database, Smartphone, Zap, Users, MessageSquare, Lightbulb, FileCode, Layers, Brain } from 'lucide-react';

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
  const { skills } = useSkills();
  const iconMap: Record<string, ReactNode> = {
    Monitor: <Monitor size={24} />,
    Server: <Server size={24} />,
    Database: <Database size={24} />,
    Smartphone: <Smartphone size={24} />,
    Zap: <Zap size={24} />,
    Users: <Users size={24} />,
    MessageSquare: <MessageSquare size={24} />,
    Lightbulb: <Lightbulb size={24} />,
    FileCode: <FileCode size={24} />,
    Layers: <Layers size={24} />,
    Brain: <Brain size={24} />,
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl text-indigo-400 font-semibold mb-6">Keahlian</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.name}
              title={skill.name}
              description={skill.description || ''}
              icon={iconMap[skill.category?.icon_name || 'Layers'] || <Layers size={24} />}
              delay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 