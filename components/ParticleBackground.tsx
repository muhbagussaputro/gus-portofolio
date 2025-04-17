'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decreaseRate: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColors?: string[];
  interactive?: boolean;
  maxSpeed?: number;
}

export default function ParticleBackground({
  particleCount = 50,
  particleColors = ['#6366f1', '#8b5cf6'],
  interactive = true,
  maxSpeed = 0.5
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number, y: number, radius: number }>({
    x: 0,
    y: 0,
    radius: 120
  });
  const animationRef = useRef<number>();
  const initialized = useRef(false);

  // Handle resize dengan debounce untuk performa yang lebih baik
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Implementasi debounce
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Ukuran canvas
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    
    // Setel ukuran canvas
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    
    // Inisialisasi ulang partikel
    initializeParticles();
  }, []);
  
  // Inisialisasi partikel - dioptimasi dengan useMemo dan useCallback
  const initializeParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const newParticles: Particle[] = [];
    
    // Kurangi partikel pada perangkat mobile untuk performa
    let actualParticleCount = particleCount;
    if (window.innerWidth < 768) {
      actualParticleCount = Math.floor(particleCount / 2);
    }
    
    for (let i = 0; i < actualParticleCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const directionX = Math.random() * 0.2 - 0.1;
      const directionY = Math.random() * 0.2 - 0.1;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const opacity = Math.random() * 0.5 + 0.1;
      
      newParticles.push({
        x,
        y,
        size,
        speedX: directionX * maxSpeed,
        speedY: directionY * maxSpeed,
        color,
        alpha: opacity,
        decreaseRate: 0.002 + Math.random() * 0.002
      });
    }
    
    particlesRef.current = newParticles;
  }, [particleCount, particleColors, maxSpeed]);
  
  // Update posisi partikel dan render
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    particlesRef.current.forEach((particle, index) => {
      // Update posisi
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Handle batas canvas
      if (particle.x > dimensions.width || particle.x < 0) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y > dimensions.height || particle.y < 0) {
        particle.speedY = -particle.speedY;
      }
      
      // Interaksi mouse jika diaktifkan
      if (interactive) {
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          
          particle.x += forceDirectionX * force * 1.5;
          particle.y += forceDirectionY * force * 1.5;
        }
      }
      
      // Draw particle
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      
      // Connect nearby particles with lines
      connectParticles(particle, index, ctx);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, interactive, maxSpeed]);
  
  // Connect particles with lines when they are close to each other
  const connectParticles = (particle: Particle, index: Particle['x'], ctx: CanvasRenderingContext2D) => {
    for (let i = index + 1; i < particlesRef.current.length; i++) {
      const otherParticle = particlesRef.current[i];
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        // Calculate line opacity based on distance
        const opacity = (100 - distance) / 100 * 0.3;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  // Handle mouse move untuk interaksi
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);
  
  // Inisialisasi dan cleanup
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, animate, handleMouseMove, interactive]);

  return (
    <motion.canvas
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      ref={canvasRef}
      className="fixed inset-0 z-0 bg-transparent pointer-events-none"
    />
  );
} 