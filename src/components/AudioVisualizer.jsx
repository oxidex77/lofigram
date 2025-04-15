// src/components/AudioVisualizer.jsx
import React, { useEffect, useRef } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useThemeContext } from '../contexts/ThemeContext';

const AudioVisualizer = () => {
  const { isPlaying, currentTime } = usePlayerContext();
  const { themeColors } = useThemeContext();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  
  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas.offsetParent === null) return; // Skip if not visible
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles if needed
    if (particlesRef.current.length === 0) {
      const particleCount = 150;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: Math.random() > 0.5 ? themeColors.primary : themeColors.secondary,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    }
    
    // For the hackathon, we'll simulate audio data
    // In a real app, we would use the Web Audio API's AnalyserNode to get frequency data
    const analyserDataPoints = 256;
    let frequencyData = new Uint8Array(analyserDataPoints);
    
    // Function to generate simulated frequency data
    const generateSimulatedData = (time) => {
      for (let i = 0; i < analyserDataPoints; i++) {
        // Create harmonious wave patterns that change over time
        const angle = (i / analyserDataPoints) * Math.PI * 2;
        const wave1 = Math.sin(angle * 4 + time / 1000) * 50;
        const wave2 = Math.sin(angle * 8 - time / 800) * 30;
        const wave3 = Math.sin(angle * 2 + time / 1200) * 20;
        const wave4 = Math.sin(angle * 6 - time / 900) * 15;
        
        // Add some randomness but keep it minimal for a smooth look
        const random = Math.random() * 10;
        
        // Combine waves and constrain to 0-255 range
        frequencyData[i] = Math.max(0, Math.min(255, wave1 + wave2 + wave3 + wave4 + random));
      }
    };
    
    // Animation function - circular visualizer with particles
    const animate = () => {
      if (!canvas.offsetParent) {
        rafRef.current = requestAnimationFrame(animate);
        return; // Skip rendering if not visible
      }
      
      // Clear canvas with slight opacity to create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Generate audio data
      generateSimulatedData(currentTime * 1000);
      
      // Draw center circle visualizer
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const baseRadius = Math.min(centerX, centerY) * 0.3;
      
      // Draw frequency bars in a circle
      for (let i = 0; i < analyserDataPoints; i += 4) { // Skip some points for performance
        const amplitude = frequencyData[i] / 255; // Normalize to 0-1
        const angle = (i / analyserDataPoints) * Math.PI * 2;
        
        // Calculate inner and outer points
        const innerRadius = baseRadius;
        const outerRadius = baseRadius + (baseRadius * amplitude * 0.8);
        
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * outerRadius;
        const y2 = centerY + Math.sin(angle) * outerRadius;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `${themeColors.primary}40`); // 25% opacity
        gradient.addColorStop(1, `${themeColors.secondary}${Math.round(amplitude * 255).toString(16).padStart(2, '0')}`);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Add glow effect for high amplitudes
        if (amplitude > 0.7) {
          ctx.beginPath();
          ctx.arc(x2, y2, 2 + amplitude * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${themeColors.secondary}aa`;
          ctx.fill();
        }
      }
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Find the nearest frequency data point to this particle
// src/components/AudioVisualizer.jsx (continued)
        // Find the nearest frequency data point to this particle
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const index = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * analyserDataPoints) % analyserDataPoints;
        const amplitude = frequencyData[index] / 255;
        
        // Update particle position based on its speed and audio amplitude
        particle.x += particle.speedX * (1 + amplitude * 2);
        particle.y += particle.speedY * (1 + amplitude * 2);
        
        // Bounce off the edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.offsetHeight) {
          particle.speedY *= -1;
        }
        
        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.offsetWidth, particle.x));
        particle.y = Math.max(0, Math.min(canvas.offsetHeight, particle.y));
        
        // Draw particle with size based on audio amplitude
        const particleSize = particle.size * (1 + amplitude * 1.5);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Draw connecting lines between nearby particles for a network effect
        particlesRef.current.forEach(otherParticle => {
          const dx2 = particle.x - otherParticle.x;
          const dy2 = particle.y - otherParticle.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (distance2 < 50) { // Only connect nearby particles
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${particle.color}${Math.round((1 - distance2 / 50) * 50).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      // Draw center glow
      const centerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, baseRadius * 0.8
      );
      centerGlow.addColorStop(0, `${themeColors.primary}80`);
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();
      
      // Pulsating ring effect
      const pulseSize = baseRadius * (1 + Math.sin(currentTime * 2) * 0.1);
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = `${themeColors.secondary}40`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, currentTime, themeColors]);
  
  return <canvas ref={canvasRef} className="audio-visualizer"></canvas>;
};

export default AudioVisualizer;