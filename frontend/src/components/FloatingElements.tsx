import { motion } from "framer-motion";

export const FloatingLeaf = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      opacity: { duration: 0.5, delay },
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay }
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 5C12 5 5 12 5 20C5 28 12 35 20 35C28 35 35 28 35 20"
        stroke="hsl(142 70% 45%)"
        strokeWidth="2"
        fill="hsl(142 70% 45% / 0.2)"
      />
      <path d="M20 5C20 20 20 35 20 35" stroke="hsl(142 70% 45%)" strokeWidth="1.5" />
    </svg>
  </motion.div>
);

export const FloatingSun = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ 
      scale: [1, 1.1, 1],
      rotate: [0, 180, 360]
    }}
    transition={{ 
      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
    }}
  >
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="20" fill="hsl(45 95% 55%)" />
      <circle cx="40" cy="40" r="25" fill="hsl(45 95% 55% / 0.3)" />
      <circle cx="40" cy="40" r="32" fill="hsl(45 95% 55% / 0.15)" />
    </svg>
  </motion.div>
);

export const FloatingCloud = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, x: -50 }}
    animate={{ 
      opacity: 0.8,
      x: [0, 30, 0]
    }}
    transition={{ 
      opacity: { duration: 1, delay },
      x: { duration: 15, repeat: Infinity, ease: "easeInOut", delay }
    }}
  >
    <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
      <ellipse cx="50" cy="30" rx="40" ry="15" fill="white" fillOpacity="0.9" />
      <ellipse cx="30" cy="25" rx="25" ry="12" fill="white" fillOpacity="0.9" />
      <ellipse cx="70" cy="25" rx="20" ry="10" fill="white" fillOpacity="0.9" />
    </svg>
  </motion.div>
);

export const FloatingWheat = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none origin-bottom ${className}`}
    animate={{ 
      rotate: [-3, 3, -3]
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    <svg width="30" height="80" viewBox="0 0 30 80" fill="none">
      <path d="M15 80V30" stroke="hsl(40 85% 55%)" strokeWidth="2" />
      <ellipse cx="15" cy="25" rx="8" ry="12" fill="hsl(40 85% 55%)" />
      <ellipse cx="8" cy="35" rx="6" ry="10" fill="hsl(40 85% 55%)" transform="rotate(-20 8 35)" />
      <ellipse cx="22" cy="35" rx="6" ry="10" fill="hsl(40 85% 55%)" transform="rotate(20 22 35)" />
      <ellipse cx="15" cy="15" rx="5" ry="8" fill="hsl(40 85% 55%)" />
    </svg>
  </motion.div>
);

export const GrowingSeed = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`${className}`}
    initial={{ scale: 0.8, opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path
          d="M30 55V35"
          stroke="hsl(142 70% 45%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          d="M30 35C30 25 20 20 15 25C25 25 30 35 30 35Z"
          fill="hsl(142 70% 45%)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.path
          d="M30 35C30 25 40 20 45 25C35 25 30 35 30 35Z"
          fill="hsl(142 60% 50%)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <ellipse cx="30" cy="55" rx="15" ry="4" fill="hsl(30 45% 30% / 0.3)" />
      </svg>
    </motion.div>
  </motion.div>
);