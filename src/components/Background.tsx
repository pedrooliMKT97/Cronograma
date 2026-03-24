import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SHAPES = ['circle', 'square', 'triangle', 'star', 'hexagon'];
const COLORS = [
  'rgba(59, 130, 246, 0.6)', // Blue
  'rgba(168, 85, 247, 0.6)', // Purple
  'rgba(236, 72, 153, 0.6)', // Pink
  'rgba(16, 185, 129, 0.6)', // Emerald
  'rgba(249, 115, 22, 0.6)', // Orange
];

export const Background = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const size = Math.random() * 25 + 10; // 10px to 35px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 20 + 15; // 15s to 35s
      const delay = Math.random() * 20;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const drift = Math.random() * 100 - 50; // -50 to 50

      return { id: i, shape, size, left, duration, delay, color, drift };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#09090b]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-10%]"
          style={{ left: `${p.left}%`, color: p.color }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, p.drift, p.drift * 1.5],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          {p.shape === 'circle' && <div style={{ width: p.size, height: p.size, borderRadius: '50%', border: '1.5px solid currentColor', boxShadow: `0 0 10px ${p.color}` }} />}
          {p.shape === 'square' && <div style={{ width: p.size, height: p.size, border: '1.5px solid currentColor', borderRadius: '4px', boxShadow: `0 0 10px ${p.color}` }} />}
          {p.shape === 'triangle' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 5px ${p.color})` }}>
              <polygon points="12 2 22 20 2 20" />
            </svg>
          )}
          {p.shape === 'star' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 5px ${p.color})` }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
          {p.shape === 'hexagon' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 5px ${p.color})` }}>
              <polygon points="12 2 22 7 22 17 12 22 2 17 2 7 12 2" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
