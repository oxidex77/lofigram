// src/animations/animations.js
// Collection of reusable Framer Motion animations for Lofigram

// Page Transitions
export const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
};
export const smoothPageTransition = {
    initial: { 
      opacity: 0,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for natural motion
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0,
      scale: 1.02,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Smooth fade transition
  export const fadeTransition = {
    initial: { 
      opacity: 0 
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };
  
  // Slide up transition
  export const slideUpTransition = {
    initial: { 
      opacity: 0,
      y: 20 
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Staggered children container animation
  export const staggerContainer = {
    initial: { 
      opacity: 0 
    },
    animate: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  // Child item animation
  export const staggerItem = {
    initial: { 
      y: 15, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      y: 15, 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Smooth tab transitions
  export const tabTransition = {
    initial: { 
      opacity: 0,
      x: 10 
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0,
      x: -10,
      transition: { 
        duration: 0.2, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Player screen transitions
  export const playerTransition = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Mini player slide up transition
  export const miniPlayerTransition = {
    initial: { 
      y: 100, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };
  
  // Modal slide up from bottom
  export const modalTransition = {
    initial: { 
      y: 50, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }
    },
    exit: { 
      y: 50, 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };
// Staggered children animations
// export const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.1,
//             delayChildren: 0.2
//         }
//     }
// };

// Loading animations
export const loadingPulse = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Album cover animations
export const albumCoverHover = {
    rest: {
        scale: 1,
        boxShadow: "0px 0px 0px rgba(0,0,0,0.1)",
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    hover: {
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.15)",
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// Album cover rotation for player
// src/animations/animations.js
// Replace the albumRotation with this improved version:

export const albumAnimation = {
    initial: {
        scale: 1,
        boxShadow: "0px 0px 5px rgba(236, 72, 153, 0.3)"
    },
    animate: {
        scale: [1, 1.02, 1],
        boxShadow: [
            "0px 0px 5px rgba(236, 72, 153, 0.3)",
            "0px 0px 20px rgba(236, 72, 153, 0.6)",
            "0px 0px 5px rgba(236, 72, 153, 0.3)",
        ],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    },
    paused: {
        scale: 1,
        boxShadow: "0px 0px 5px rgba(236, 72, 153, 0.3)",
        transition: {
            duration: 0.5
        }
    }
};
// Heart button animations
export const heartBeat = {
    initial: { scale: 1 },
    liked: {
        scale: [1, 1.3, 1],
        transition: {
            duration: 0.4,
            times: [0, 0.5, 1]
        }
    }
};

// Button press animations
export const buttonTap = {
    tap: { scale: 0.95 }
};

// Card flip animation
export const cardFlip = {
    front: {
        rotateY: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    back: {
        rotateY: 180,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// Floating animation for decorative elements
export const floatingAnimation = {
    initial: { y: 0 },
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity
        }
    }
};

// Glow animation for player screen
export const glowPulse = {
    initial: {
        boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)"
    },
    animate: {
        boxShadow: [
            "0 0 5px rgba(255, 255, 255, 0.5)",
            "0 0 20px rgba(255, 255, 255, 0.8)",
            "0 0 5px rgba(255, 255, 255, 0.5)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Modal animations
export const modalAnimation = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

// Backdrop blur for modals
export const backdropAnimation = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
};

// Tab switch animation
export const tabSwitchAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

// Wave animation for music bars
export const musicWave = {
    initial: { height: '20%' },
    animate: (custom) => ({
        height: ['20%', `${60 + custom * 20}%`, '20%'],
        transition: {
            duration: 0.7 + custom * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: custom * 0.2
        }
    })
};

// Loading dots animation
export const loadingDots = {
    initial: { opacity: 0 },
    animate: (custom) => ({
        opacity: [0, 1, 0],
        y: [0, -5, 0],
        transition: {
            duration: 1,
            repeat: Infinity,
            delay: custom * 0.2
        }
    })
};