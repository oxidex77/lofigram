// src/components/VinylRecord.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useThemeContext } from '../contexts/ThemeContext';

const VinylRecord = ({ albumCover, isPlaying, isExpanded }) => {
  const { themeColors } = useThemeContext();
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  
  // Keep track of rotation manually with a ref
  useEffect(() => {
    let animationFrame;
    let lastTime = 0;
    const rotationSpeed = 45; // degrees per second
    
    const animate = (time) => {
      if (lastTime === 0) {
        lastTime = time;
      }
      
      const deltaTime = time - lastTime;
      lastTime = time;
      
      if (isPlaying) {
        rotationRef.current += (rotationSpeed * deltaTime) / 1000;
        setRotation(rotationRef.current % 360);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);
  
  // Handle spin animation with controls
  useEffect(() => {
    if (isPlaying) {
      controls.start({
        rotate: 360,
        transition: {
          duration: 8,
          ease: "linear",
          repeat: Infinity
        }
      });
    } else {
      controls.stop();
    }
  }, [isPlaying, controls]);
  
  // Generate groove circles for vinyl effect
  const generateGrooves = () => {
    const grooves = [];
    const numGrooves = 8;
    
    for (let i = 0; i < numGrooves; i++) {
      const radius = 92 - (i * 10);
      grooves.push(
        <circle 
          key={i} 
          cx="100" 
          cy="100" 
          r={radius} 
          fill="none" 
          stroke="rgba(0, 0, 0, 0.2)" 
          strokeWidth="1"
        />
      );
    }
    
    return grooves;
  };
  
  return (
    <div className={`vinyl-container ${isExpanded ? 'large' : 'small'}`}>
      {/* Vinyl shadow effect */}
      <div className="vinyl-shadow"></div>
      
      {/* The record */}
      <motion.div 
        className="vinyl-record"
        animate={controls}
        style={{ 
          rotate: rotation,
          originX: 0.5, 
          originY: 0.5 
        }}
      >
        {/* SVG for the vinyl record with grooves */}
        <svg 
          viewBox="0 0 200 200" 
          className="vinyl-svg"
        >
          {/* Outer ring */}
          <circle cx="100" cy="100" r="100" fill="rgba(10, 10, 10, 0.8)" />
          
          {/* Grooves */}
          {generateGrooves()}
          
          {/* Center hole */}
          <circle cx="100" cy="100" r="15" fill="#111" />
          <circle cx="100" cy="100" r="5" fill="#333" />
        </svg>
        
        {/* Label (the album cover) */}
        <div 
          className="vinyl-label"
          style={{ 
            backgroundImage: `url(${albumCover})`,
            borderColor: themeColors.primary
          }}
        ></div>
        
        {/* Reflection effect */}
        <div className="vinyl-reflection"></div>
      </motion.div>
      
      {/* Arm animation */}
      <div className={`vinyl-arm ${isPlaying ? 'playing' : ''}`}>
        <div className="arm-base">
          <div className="arm-pivot"></div>
        </div>
        <div className="arm-body">
          <div className="arm-head"></div>
        </div>
      </div>
    </div>
  );
};

export default VinylRecord;