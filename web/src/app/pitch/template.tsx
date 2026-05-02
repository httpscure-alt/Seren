"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Pitch segment remounts on each route change → soft entry without fighting RSC hydration.
 */
export default function PitchTemplate({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="pitch-motion-page-root">{children}</div>;
  }

  return (
    <motion.div
      className="pitch-motion-page-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
