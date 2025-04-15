// src/components/Background.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../contexts/ThemeContext';

const Background = ({ background }) => {
  const canvasRef = useRef(null);
  const { themeColors, isDarkMode } = useThemeContext();
  
  // Animation logic for background effects
  useEffect(() => {
    if (!canvasRef.current) return;

    // src/components/Background.jsx (continued)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { raindrops, steam, stars } = background.animations;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let particles = [];
    
    // Create particles based on active animations
    if (raindrops) {
      // Create raindrops
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 15 + 5,
          thickness: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          type: 'raindrop'
        });
      }
    }
    
    if (steam) {
      // Create steam particles
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * window.innerWidth * 0.5 + window.innerWidth * 0.3,
          y: window.innerHeight - Math.random() * 150,
          size: Math.random() * 15 + 5,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          growthRate: Math.random() * 0.1 + 0.05,
          maxSize: Math.random() * 30 + 20,
          rotation: Math.random() * Math.PI,
          rotationSpeed: Math.random() * 0.02 - 0.01,
          type: 'steam'
        });
      }
    }
    
    if (stars) {
      // Create stars with twinkling effect
      for (let i = 0; i < 150; i++) {
        const size = Math.random() * 2 + 0.5;
        const twinkleSpeed = Math.random() * 0.03;
        
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.7,
          size: size,
          baseSize: size,
          twinkleSpeed: twinkleSpeed,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          twinkleTime: Math.random() * 100,
          opacity: Math.random() * 0.5 + 0.3,
          color: Math.random() > 0.8 ? themeColors.primary : Math.random() > 0.5 ? themeColors.secondary : '#FFFFFF',
          type: 'star',
          // Add shooting star probability
          shooting: Math.random() > 0.99,
          shootingSpeed: Math.random() * 15 + 5,
          shootingAngle: Math.PI / 4 + (Math.random() * Math.PI / 4),
          shootingLength: Math.random() * 150 + 50,
          shootingProgress: 0
        });
      }
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw and update particles
      particles.forEach((p, index) => {
        if (p.type === 'raindrop') {
          // Draw raindrop
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          
          // Create gradient for raindrop
          const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.length);
          gradient.addColorStop(0, `rgba(220, 240, 255, 0)`);
          gradient.addColorStop(1, `rgba(220, 240, 255, ${p.opacity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();
          
          // Draw splash effect at bottom
          if (p.y + p.length > window.innerHeight - 5 && Math.random() > 0.7) {
            ctx.beginPath();
            ctx.arc(p.x, window.innerHeight, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 240, 255, ${p.opacity * 0.7})`;
            ctx.fill();
          }
          
          // Update raindrop
          p.y += p.speed;
          if (p.y > window.innerHeight) {
            p.y = -p.length;
            p.x = Math.random() * window.innerWidth;
          }
        } else if (p.type === 'steam') {
          // Draw steam
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          // Draw cloud-like shape for steam
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
          
          // Add a second circle for more cloud-like appearance
          ctx.beginPath();
          ctx.arc(p.size * 0.5, -p.size * 0.3, p.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
          
          ctx.restore();
          
          // Update steam
          p.y -= p.speed;
          p.x += Math.sin(p.y / 30) * 0.5;
          p.size += p.growthRate;
          p.opacity -= 0.003;
          p.rotation += p.rotationSpeed;
          
          if (p.opacity <= 0 || p.size > p.maxSize || p.y < 0) {
            particles[index] = {
              x: Math.random() * window.innerWidth * 0.5 + window.innerWidth * 0.3,
              y: window.innerHeight - Math.random() * 150,
              size: Math.random() * 15 + 5,
              speed: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.3 + 0.1,
              growthRate: Math.random() * 0.1 + 0.05,
              maxSize: Math.random() * 30 + 20,
              rotation: Math.random() * Math.PI,
              rotationSpeed: Math.random() * 0.02 - 0.01,
              type: 'steam'
            };
          }
        } else if (p.type === 'star') {
          if (p.shooting) {
            // Draw shooting star
            const tailLength = p.shootingLength * (1 - p.shootingProgress);
            
            // Calculate start and end positions
            const startX = p.x;
            const startY = p.y;
            const endX = p.x + Math.cos(p.shootingAngle) * tailLength;
            const endY = p.y + Math.sin(p.shootingAngle) * tailLength;
            
            // Create gradient for the tail
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, `${p.color}`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            // Draw the tail
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw the head
            ctx.beginPath();
            ctx.arc(startX, startY, p.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Update shooting star
            p.x += Math.cos(p.shootingAngle) * p.shootingSpeed;
            p.y += Math.sin(p.shootingAngle) * p.shootingSpeed;
            p.shootingProgress += 0.01;
            
            // Reset if off screen or completed
            if (p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight || p.shootingProgress >= 1) {
              // Reset to a new shooting star after a delay
              p.shooting = false;
              
              // 5% chance to make it shoot again
              setTimeout(() => {
                if (Math.random() > 0.95) {
                  p.shooting = true;
                  p.x = Math.random() * window.innerWidth;
                  p.y = Math.random() * window.innerHeight * 0.3;
                  p.shootingProgress = 0;
                  p.shootingAngle = Math.PI / 4 + (Math.random() * Math.PI / 4);
                  p.shootingSpeed = Math.random() * 15 + 5;
                  p.shootingLength = Math.random() * 150 + 50;
                }
              }, Math.random() * 10000);
            }
          } else {
            // Draw twinkling star
            p.twinkleTime += p.twinkleSpeed;
            const twinkleFactor = Math.sin(p.twinkleTime) * 0.5 + 0.5;
            const currentSize = p.baseSize * (0.7 + twinkleFactor * 0.5);
            const currentOpacity = p.opacity * (0.7 + twinkleFactor * 0.3);
            
            // Add glow effect
            const glow = ctx.createRadialGradient(
              p.x, p.y, 0,
              p.x, p.y, currentSize * 4
            );
            glow.addColorStop(0, `${p.color}${Math.round(currentOpacity * 50).toString(16).padStart(2, '0')}`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            // Draw the star
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${Math.round(currentOpacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [background, themeColors]);

  return (
    <div className="background-container">
      <motion.div 
        className="background-image" 
        style={{ backgroundImage: `url(${background.imagePath})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="background-overlay" style={{ 
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)'
      }}/>
      <canvas ref={canvasRef} className="background-animation-canvas" />
    </div>
  );
};

export default Background;