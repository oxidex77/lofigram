import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';

const ProfileScreen = () => {
  const { userName } = useUser();
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96],
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96],
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="absolute top-20 left-1/4 w-32 h-32 bg-pink-200 rounded-full opacity-40 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-32 right-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-40 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center max-w-md w-full bg-white bg-opacity-70 rounded-3xl p-8 shadow-lg backdrop-filter backdrop-blur-sm"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold text-purple-700">Welcome, {userName}!</h1>
          <p className="text-purple-500 mt-2">Your kawaii lo-fi journey begins...</p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="text-center mt-4"
        >
          <motion.div
            className="inline-flex items-center justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-purple-600">Preparing your music</span>
            {[0, 1, 2].map((dot, i) => (
              <motion.span
                key={i}
                className="text-purple-600"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-1/4 text-pink-500 text-2xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♫
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/3 text-purple-500 text-3xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♪
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-1/3 text-pink-400 text-xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♩
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;