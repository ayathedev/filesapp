import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AmbientCanvasProps {
  color?: string;
}

export function AmbientCanvas({ color = '#3b82f6' }: AmbientCanvasProps) {
  const [activeColor, setActiveColor] = useState(color);

  useEffect(() => {
    if (color) {
      setActiveColor(color);
    }
  }, [color]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary ambient lighting blob */}
      <motion.div
        animate={{
          backgroundColor: activeColor,
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[140px]"
      />

      {/* Secondary accent blob */}
      <motion.div
        animate={{
          backgroundColor: activeColor,
          scale: [1.1, 1, 1.1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] rounded-full blur-[160px]"
      />

      {/* Grid line texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
