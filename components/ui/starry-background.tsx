'use client';

import { useEffect, useState } from 'react';
import { useThemeSync } from './hero-space';

const StarryBackground = () => {
  const [theme] = useThemeSync();
  const [stars, setStars] = useState<Array<{id: number, top: number, left: number, size: number, opacity: number, animationDelay: string}>>([]);

  useEffect(() => {
    // Generate random stars with optimized count for performance
    const generatedStars = Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: `${Math.random() * 5}s`
    }));
    
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-40 overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse will-change-transform"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle 3s infinite ${star.animationDelay}`,
            backgroundColor: theme === 'dark' ? '#ffffff' : '#111111'
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;