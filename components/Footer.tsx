import Link from 'next/link';
import FooterClient from './FooterClient';

// Komponen server yang tidak perlu 'use client'
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-card/50 backdrop-blur-sm py-12 border-t border-dark-border relative">
      {/* Blur effects */}
      <div className="blur-bg top-10 left-1/4"></div>
      <div className="blur-bg bottom-10 right-1/4"></div>
      
      <div className="container">
        <FooterClient />

        {/* Copyright */}
        <div className="border-t border-dark-border mt-10 pt-6 text-center text-gray-500">
          © {currentYear} Portfolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 