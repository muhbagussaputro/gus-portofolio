'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function FooterClient() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MBS</span>
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Portfolio</h3>
            </Link>
            
            <p className="text-gray-400">
              Full Stack Developer & Mobile Developer dengan pengalaman lebih dari 3 tahun dalam pengembangan aplikasi.
            </p>
            
            <div className="pt-4">
              <span className="text-xs text-gray-500">Tech Stack:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Next.js', 'Kotlin', 'Android', 'Laravel', 'React', 'MySQL'].map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-[#0a0a29] border border-indigo-500/20 text-gray-400 hover:border-indigo-500/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Navigasi Cepat
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#home" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#about" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#portfolio" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Portfolio</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#community" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Community</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Hubungi Saya
            </h4>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center hover:text-indigo-400 transition-colors">
                <Mail className="h-5 w-5 mr-2 text-indigo-500" />
                <a href="mailto:muhbagussaputro.id@gmail.com">muhbagussaputro.id@gmail.com</a>
              </p>
              <p className="flex items-center hover:text-indigo-400 transition-colors">
                <Phone className="h-5 w-5 mr-2 text-indigo-500" />
                <a href="tel:+6281391782589">081391782589</a>
              </p>
              <p className="flex items-center hover:text-indigo-400 transition-colors">
                <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                Pati, Jawa Tengah, 50147
              </p>
            </div>
            <div className="flex space-x-3 pt-4">
              {/* Social Media Icons */}
              <a 
                href="https://github.com/BagusCPaste/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#0a0a29]/80 border border-indigo-500/20 
                  hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 
                  text-gray-400 hover:text-white"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com/in/gusaja" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#0a0a29]/80 border border-indigo-500/20 
                  hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 
                  text-gray-400 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="mailto:muhbagussaputro.id@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#0a0a29]/80 border border-indigo-500/20 
                  hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 
                  text-gray-400 hover:text-white"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-indigo-500/10 mt-12 pt-6 text-center text-gray-500 text-sm"
        >
          <p>&copy; {currentYear} Muh Bagus Saputro. All rights reserved.</p>
          <p className="mt-1">Full Stack Developer & Mobile Developer</p>
        </motion.div>
      </div>
    </div>
  );
} 