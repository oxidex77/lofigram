// src/components/Character.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { usePlayerContext } from '../contexts/PlayerContext';
import { getCharacterResponse, getEasterEggResponse } from '../mockMusicData';
import Lottie from 'lottie-react';

// We'll need to install lottie-react: npm install lottie-react

const Character = () => {
  const { 
    currentCharacter, 
    characterMood, 
    speechBubble, 
    setSpeechBubble,
    setCharacterReaction
  } = useThemeContext();
  
  const { currentTrack, isPlaying } = usePlayerContext();
  
  const [clickCount, setClickCount] = useState(0);
  const [easterEggActivated, setEasterEggActivated] = useState(false);
  const lottieRef = useRef(null);
  const clickTimerRef = useRef(null);
  
  // Reset click counter after a timeout
  useEffect(() => {
    if (clickCount > 0) {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
    
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, [clickCount]);
  
  // Handle easter egg activation
  useEffect(() => {
    if (clickCount >= 5 && !easterEggActivated) {
      setEasterEggActivated(true);
      setCharacterReaction('secret');
      
      // Show easter egg speech bubble
      const response = getEasterEggResponse(currentCharacter, clickCount);
      setSpeechBubble(response);
      
      // Reset after animation completes
      setTimeout(() => {
        setEasterEggActivated(false);
        setCharacterReaction('happy');
        
        // Keep the speech bubble visible a bit longer
        setTimeout(() => {
          setSpeechBubble(null);
        }, 2000);
      }, 5000);
    }
  }, [clickCount, easterEggActivated, currentCharacter, setCharacterReaction, setSpeechBubble]);
  
  // Character reaction to track changes
  useEffect(() => {
    if (currentTrack && isPlaying) {
      // Generate response based on track mood
      const response = getCharacterResponse(currentCharacter, currentTrack);
      
      // Show response with a delay to make it seem more natural
      setTimeout(() => {
        setSpeechBubble(response);
        
        // Hide speech bubble after a few seconds
        setTimeout(() => {
          setSpeechBubble(null);
        }, 3000);
      }, 1500);
    }
  }, [currentTrack?.id, isPlaying, currentCharacter, setSpeechBubble]);
  
  // Handle character click
  const handleCharacterClick = () => {
    // Increment click counter
    setClickCount(prev => prev + 1);
    
    // Normal reaction for 1-4 clicks
    if (clickCount < 4) {
      setCharacterReaction('happy');
      
      // Reset to idle after a short time
      setTimeout(() => {
        setCharacterReaction('idle');
      }, 1000);
    }
  };
  
  // Determine which animation to load based on character state
  const getAnimationPath = () => {
    if (!currentCharacter || !currentCharacter.animations) {
      return null;
    }
    
    return currentCharacter.animations[characterMood] || currentCharacter.animations.idle;
  };

  return (
    <div className="character-container">
      <div 
        className={`character ${characterMood} ${easterEggActivated ? 'easter-egg' : ''}`}
        onClick={handleCharacterClick}
      >
        {/* Lottie animation instead of emoji */}
        <Lottie
          ref={lottieRef}
          animationData={getAnimationPath()}
          loop={characterMood !== 'secret'} // Don't loop the easter egg animation
          autoplay={true}
          className="character-animation"
          style={{ 
            width: characterMood === 'secret' ? '150px' : '100px',
            height: characterMood === 'secret' ? '150px' : '100px'
          }}
        />
      </div>
      
      {speechBubble && (
        <div className="speech-bubble">
          <p>{speechBubble}</p>
          <div className="speech-bubble-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default Character;