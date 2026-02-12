'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, FileText, Users, BarChart3, Settings, Plus, Search, Sparkles } from 'lucide-react';
import Layout from '@/app/(home)/Layout';

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const adminSections: AdminSection[] = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Kelola data profil untuk hero dan about',
    icon: Settings,
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'upload',
    title: 'Media Upload',
    description: 'Upload images, videos, and documents to Cloudflare R2',
    icon: Upload,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Add, edit, and organize your portfolio projects',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'content',
    title: 'Education',
    description: 'Manage your educational background and achievements',
    icon: Users,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Manage work experience and career history',
    icon: Image,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Manage client testimonials and community feedback',
    icon: BarChart3,
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'community-stats',
    title: 'Community Stats',
    description: 'Manage community statistics and metrics',
    icon: Users,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Manage technical skills and competencies',
    icon: Settings,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'homepage-assets',
    title: 'Homepage Assets',
    description: 'Manage profile photos, background videos, and animations',
    icon: Sparkles,
    color: 'from-cyan-500 to-cyan-600',
  },
];

const AdminCard = ({ section, onClick }: { section: AdminSection; onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer"
    onClick={onClick}
  >
    <div className="h-full p-6 rounded-xl bg-[#0a0a29]/40 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}>
        <section.icon size={24} className="text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{section.description}</p>
      
      <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
        <span>Manage</span>
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </motion.div>
);

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    
    // Navigate to the specific admin section
    const routes: { [key: string]: string } = {
      profile: '/admin/profile',
      upload: '/admin/upload',
      projects: '/admin/projects',
      content: '/admin/education',
      experience: '/admin/experience',
      testimonials: '/admin/testimonials',
      skills: '/admin/skills',
      'homepage-assets': '/admin/homepage-assets',
    };
    
    if (routes[sectionId]) {
      window.location.href = routes[sectionId];
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Admin Panel
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Manage your portfolio content, upload media, and configure settings
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-12 justify-center"
          >
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
              <Plus size={20} className="mr-2" />
              New Project
            </button>
            <button className="flex items-center px-6 py-3 bg-[#0a0a29]/60 border border-indigo-500/20 text-white rounded-lg hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300">
              <Upload size={20} className="mr-2" />
              Upload Media
            </button>
            <button className="flex items-center px-6 py-3 bg-[#0a0a29]/60 border border-indigo-500/20 text-white rounded-lg hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300">
              <Search size={20} className="mr-2" />
              Search Content
            </button>
          </motion.div>

          {/* Admin Sections Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {adminSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <AdminCard
                  section={section}
                  onClick={() => handleSectionClick(section.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6">
              <div className="space-y-4">
                {[
                  { action: 'Uploaded new project image', time: '2 hours ago', type: 'upload' },
                  { action: 'Updated project "E-Commerce Platform"', time: '5 hours ago', type: 'edit' },
                  { action: 'Added new testimonial', time: '1 day ago', type: 'add' },
                  { action: 'Published blog post', time: '2 days ago', type: 'publish' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activity.type === 'upload' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'edit' ? 'bg-orange-500/20 text-orange-400' :
                        activity.type === 'add' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {activity.type === 'upload' ? <Upload size={16} /> :
                         activity.type === 'edit' ? <FileText size={16} /> :
                         activity.type === 'add' ? <Plus size={16} /> :
                         <FileText size={16} />}
                      </div>
                      <span className="text-white">{activity.action}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}