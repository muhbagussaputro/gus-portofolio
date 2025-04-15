'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/app/(home)/Layout';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web App',
    image: '/projects/ecommerce.jpg',
    description:
      'Platform e-commerce modern dengan fitur keranjang belanja, pembayaran, dan manajemen pesanan.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
  },
  {
    id: 2,
    title: 'Portfolio Website',
    category: 'Web Design',
    image: '/projects/portfolio.jpg',
    description:
      'Website portofolio responsif dengan animasi smooth dan desain modern.',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
  },
  {
    id: 3,
    title: 'Task Management App',
    category: 'Web App',
    image: '/projects/taskmanager.jpg',
    description:
      'Aplikasi manajemen tugas dengan fitur drag-and-drop dan real-time updates.',
    technologies: ['React', 'Firebase', 'Material UI'],
  },
  {
    id: 4,
    title: 'Blog Platform',
    category: 'Web App',
    image: '/projects/blog.jpg',
    description:
      'Platform blog dengan sistem CMS dan optimasi SEO terintegrasi.',
    technologies: ['Next.js', 'MDX', 'Tailwind CSS'],
  },
];

const categories = ['All', 'Web App', 'Web Design'];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(
    null
  );

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
            <p className="text-xl text-neutral-600">
              Koleksi proyek terbaik saya dalam pengembangan web
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#b3cde0] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video bg-neutral-200" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-[#b3cde0] mb-2">{project.category}</p>
                    <p className="text-neutral-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video bg-neutral-200" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedProject.title}
                  </h2>
                  <p className="text-[#b3cde0] mb-4">{selectedProject.category}</p>
                  <p className="text-neutral-600 mb-6">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn-primary"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
} 