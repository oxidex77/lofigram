// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  characters, 
  backgrounds, 
  getBackgroundByMood, 
  getBackgroundByTime, 
  getTimeOfDay,
  getCharacterResponse
} from '../mockMusicData';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(characters[0]);
  const [characterMood, setCharacterMood] = useState('idle');
  const [currentBackground, setCurrentBackground] = useState(backgrounds[0]);
  const [speechBubble, setSpeechBubble] = useState(null);
  const [themeColors, setThemeColors] = useState({
    primary: '#FFB7D5',
    secondary: '#B8E0FF',
    background: isDarkMode ? '#2A2E4A' : '#FFF5F9'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Set background based on time of day on initial load
  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    setCurrentBackground(getBackgroundByTime(timeOfDay));
    
    // Simulate loading time for initial animations
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Show welcome message based on time of day
    if (currentCharacter && currentCharacter.sayings) {
      const timeMessages = currentCharacter.sayings.timeOfDay[timeOfDay];
      if (timeMessages && timeMessages.length > 0) {
        const randomMessage = timeMessages[Math.floor(Math.random() * timeMessages.length)];
        setSpeechBubble(randomMessage);
        
        // Hide speech bubble after 3 seconds
        setTimeout(() => {
          setSpeechBubble(null);
        }, 3000);
      }
    }
  }, []);
  
  // Update theme colors when dark mode changes
  useEffect(() => {
    setThemeColors(prev => ({
      ...prev,
      background: isDarkMode ? '#2A2E4A' : '#FFF5F9'
    }));
  }, [isDarkMode]);
  
  // Character message timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!speechBubble && Math.random() > 0.85) { // 15% chance to show a speech bubble
        const timeOfDay = getTimeOfDay();
        const timeMessages = currentCharacter.sayings.timeOfDay[timeOfDay];
        if (timeMessages && timeMessages.length > 0) {
          const randomMessage = timeMessages[Math.floor(Math.random() * timeMessages.length)];
          setSpeechBubble(randomMessage);
          
          // Hide speech bubble after 3 seconds
          setTimeout(() => {
            setSpeechBubble(null);
          }, 3000);
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentCharacter, speechBubble]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeCharacter = (characterId) => {
    const character = characters.find(char => char.id === characterId);
    if (character) {
      setIsLoading(true);
      
      // Add a small delay for transition animation
      setTimeout(() => {
        setCurrentCharacter(character);
        setCharacterMood('happy'); // Show happy animation on character change
        
        // Update theme colors based on character
        setThemeColors(prev => ({
          ...prev,
          primary: character.color,
        }));
        
        // Reset to idle after showing happy animation
        setTimeout(() => {
          setCharacterMood('idle');
          setIsLoading(false);
        }, 1500);
      }, 300);
    }
  };

  const setCharacterReaction = (mood) => {
    setCharacterMood(mood);
    
    // Reset to idle after a few seconds for temporary reactions
    if (mood !== 'idle' && mood !== 'secret') {
      setTimeout(() => {
        setCharacterMood('idle');
      }, 3000);
    }
  };

  const changeBackground = (backgroundId) => {
    const background = backgrounds.find(bg => bg.id === backgroundId);
    if (background) {
      setIsLoading(true);
      
      // Add a small delay for transition animation
      setTimeout(() => {
        setCurrentBackground(background);
        setIsLoading(false);
      }, 300);
    }
  };

  const setBackgroundByMood = (mood) => {
    const background = getBackgroundByMood(mood);
    setCurrentBackground(background);
  };
  
  // Set theme based on track colors
  const updateThemeFromTrack = (track) => {
    if (track && track.themeColor && track.secondaryColor) {
      setThemeColors({
        primary: track.themeColor,
        secondary: track.secondaryColor,
        background: isDarkMode ? '#2A2E4A' : '#FFF5F9'
      });
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        currentCharacter,
        characterMood,
        currentBackground,
        speechBubble,
        themeColors,
        isLoading,
        toggleDarkMode,
        changeCharacter,
        setCharacterReaction,
        changeBackground,
        setBackgroundByMood,
        setSpeechBubble,
        updateThemeFromTrack
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};