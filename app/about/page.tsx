'use client';

import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProfilePhoto from '@/components/ProfilePhoto';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function AboutPage() {
  // Timeline animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <ParallaxBackground>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Profile Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center md:justify-end"
                  data-aos="fade-right"
                >
                  <ProfilePhoto imageUrl="/images/profile.jpg" size={250} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  data-aos="fade-left"
                >
                  <h1 className="text-4xl font-bold mb-4 gradient-text">Tentang Saya</h1>
                  <p className="text-gray-400 mb-6">
                    Saya adalah seorang pengembang web yang bersemangat dalam menciptakan
                    pengalaman digital yang menarik dan fungsional.
                  </p>
                  <p className="text-gray-400 mb-6">
                    Dengan fokus pada teknologi modern seperti React, Next.js, dan Tailwind CSS,
                    saya membangun aplikasi web yang cepat, responsif, dan mudah digunakan.
                  </p>
                  <div className="flex gap-4 mt-6">
                    <motion.a
                      href="/contact"
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hubungi Saya
                    </motion.a>
                    <motion.a
                      href="/portfolio"
                      className="py-3 px-6 rounded-lg border border-primary-indigo text-white hover:bg-primary-indigo/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Lihat Portfolio
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Experience Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
              data-aos="fade-up"
            >
              <div className="text-center mb-12">
                <span className="text-sm text-primary-indigo uppercase tracking-wider">Karir</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 gradient-text">
                  Pengalaman Profesional
                </h2>
                <div className="w-24 h-1 bg-primary-gradient rounded-full mx-auto mt-5"></div>
              </div>
              
              <motion.div 
                className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-primary-gradient space-y-12"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {[
                  {
                    title: 'Senior Web Developer',
                    company: 'Tech Company',
                    period: '2020 - Sekarang',
                    description:
                      'Memimpin tim pengembang dalam menciptakan solusi web yang inovatif. Bertanggung jawab untuk arsitektur front-end dan implementasi fitur utama.',
                  },
                  {
                    title: 'Frontend Developer',
                    company: 'Digital Agency',
                    period: '2018 - 2020',
                    description:
                      'Mengembangkan antarmuka pengguna yang responsif dan modern. Bekerja dalam tim agile dan berkolaborasi dengan desainer UI/UX untuk mengimplementasikan desain yang menarik.',
                  },
                  {
                    title: 'Junior Developer',
                    company: 'Startup Tech',
                    period: '2016 - 2018',
                    description:
                      'Mengembangkan dan memelihara situs web menggunakan HTML, CSS, dan JavaScript. Belajar dan menerapkan framework modern untuk meningkatkan pengalaman pengguna.',
                  }
                ].map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="relative"
                    data-aos="fade-left" 
                    data-aos-delay={index * 100}
                  >
                    <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary-gradient transform -translate-x-1/2 flex items-center justify-center">
                      <div className="w-3 h-3 bg-dark-bg rounded-full"></div>
                    </div>
                    <div className="card p-6">
                      <div className="flex justify-between items-start mb-4 flex-wrap">
                        <div>
                          <h3 className="text-xl font-semibold gradient-text">{exp.title}</h3>
                          <p className="text-primary-indigo mb-1">{exp.company}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary-indigo/10 text-primary-indigo text-sm">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-400">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Skills & Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto mt-24"
              data-aos="fade-up"
            >
              <div className="text-center mb-12">
                <span className="text-sm text-primary-indigo uppercase tracking-wider">Kemampuan</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 gradient-text">
                  Keahlian & Minat
                </h2>
                <div className="w-24 h-1 bg-primary-gradient rounded-full mx-auto mt-5"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="card p-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  data-aos="fade-right"
                >
                  <h3 className="text-xl font-semibold mb-4 gradient-text">Keahlian Teknis</h3>
                  <div className="space-y-4">
                    {['React & Next.js', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 'Responsive Design'].map((skill, i) => (
                      <div key={i} className="relative pl-6" data-aos="fade-up" data-aos-delay={i * 50}>
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-sm rotate-45 bg-primary-gradient"></div>
                        <p className="text-gray-400">{skill}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card p-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  data-aos="fade-left"
                >
                  <h3 className="text-xl font-semibold mb-4 gradient-text">Minat</h3>
                  <div className="space-y-4">
                    {['Web Development', 'UI/UX Design', 'Mobile Development', 'Cloud Computing', 'Artificial Intelligence'].map((interest, i) => (
                      <div key={i} className="relative pl-6" data-aos="fade-up" data-aos-delay={i * 50}>
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-sm rotate-45 bg-primary-gradient"></div>
                        <p className="text-gray-400">{interest}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>
    </Layout>
  );
} 