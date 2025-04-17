'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send } from 'lucide-react';

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

// Form input component
const FormInput = ({ label, type = 'text', placeholder, error }: { label: string; type?: string; placeholder: string; error?: string }) => (
  <motion.div
    variants={elementVariants}
    className="mb-6"
  >
    <label className="block text-white mb-2 text-sm">{label}</label>
    {type === 'textarea' ? (
      <textarea
        className={`w-full p-3 bg-[#0a0a29]/40 border ${error ? 'border-red-500' : 'border-indigo-500/20'} 
        rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
        text-white resize-none transition-all duration-300`}
        placeholder={placeholder}
        rows={5}
      ></textarea>
    ) : (
      <input
        type={type}
        className={`w-full p-3 bg-[#0a0a29]/40 border ${error ? 'border-red-500' : 'border-indigo-500/20'} 
        rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
        text-white transition-all duration-300`}
        placeholder={placeholder}
      />
    )}
    {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
  </motion.div>
);

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulasi pengiriman form
    setTimeout(() => {
      setFormStatus('success');
      
      // Kembali ke idle setelah beberapa detik
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <Section id="contact" className="bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <AnimatedHeading>
            Mari <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Terhubung</span>
          </AnimatedHeading>
          
          <AnimatedParagraph>
            Saya selalu terbuka untuk mendiskusikan proyek baru, peluang, atau sekadar bertukar ide.
          </AnimatedParagraph>
          
          <motion.div
            variants={elementVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="p-4 rounded-lg bg-[#0a0a29]/40 border border-indigo-500/10">
              <p className="text-indigo-300 font-medium mb-2">Email</p>
              <p className="text-white/70">contact@gusbagus.com</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a29]/40 border border-indigo-500/10">
              <p className="text-indigo-300 font-medium mb-2">Lokasi</p>
              <p className="text-white/70">Jakarta, Indonesia</p>
            </div>
          </motion.div>
          
          <AnimatedParagraph>
            Baik Anda memiliki pertanyaan tentang proyek, ingin mengobrol tentang pengembangan web, atau hanya ingin menyapa, formulir kontak ini adalah tempat terbaik untuk memulai percakapan.
          </AnimatedParagraph>
        </div>
        
        <motion.div
          variants={elementVariants}
        >
          <form onSubmit={handleSubmit} className="bg-[#0a0a29]/20 p-6 md:p-8 rounded-xl border border-indigo-500/10">
            <FormInput 
              label="Nama"
              placeholder="Masukkan nama Anda"
            />
            
            <FormInput 
              label="Email"
              type="email"
              placeholder="Masukkan alamat email Anda"
            />
            
            <FormInput 
              label="Pesan"
              type="textarea"
              placeholder="Ceritakan bagaimana saya dapat membantu Anda..."
            />
            
            <motion.button
              variants={elementVariants}
              type="submit"
              disabled={formStatus === 'submitting'}
              className={`w-full py-3 px-6 rounded-md ${
                formStatus === 'success' ? 'bg-green-600' :
                formStatus === 'error' ? 'bg-red-600' :
                'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800'
              } text-white font-medium flex items-center justify-center transition-all duration-300`}
            >
              {formStatus === 'submitting' ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Mengirim...</span>
                </div>
              ) : formStatus === 'success' ? (
                <span>Pesan Terkirim!</span>
              ) : formStatus === 'error' ? (
                <span>Gagal Mengirim</span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Kirim Pesan</span>
                  <Send size={18} />
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
} 