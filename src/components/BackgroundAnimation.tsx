
import React, { useEffect, useState } from 'react';

interface Orb {
  id: number;
  size: number;
  top: number;
  left: number;
  fromColor: string;
  toColor: string;
  animationDuration: number;
}

const BackgroundAnimation: React.FC = () => {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  
  useEffect(() => {
    // Colors that complement our design
    const colorPairs = [
      { from: 'from-blue-300', to: 'to-purple-400' },
      { from: 'from-indigo-300', to: 'to-blue-400' },
      { from: 'from-purple-300', to: 'to-pink-400' },
      { from: 'from-blue-400', to: 'to-cyan-300' },
    ];
    
    // Create orbs
    const newOrbs: Orb[] = [];
    for (let i = 0; i < 4; i++) {
      const colorIndex = Math.floor(Math.random() * colorPairs.length);
      const { from, to } = colorPairs[colorIndex];
      
      newOrbs.push({
        id: i,
        size: Math.floor(Math.random() * 200) + 200, // 200-400px
        top: Math.floor(Math.random() * 80), // 0-80%
        left: Math.floor(Math.random() * 80), // 0-80%
        fromColor: from,
        toColor: to,
        animationDuration: Math.floor(Math.random() * 10) + 20, // 20-30s
      });
    }
    
    setOrbs(newOrbs);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`orb ${orb.fromColor} ${orb.toColor} animate-spin-slow`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            animationDuration: `${orb.animationDuration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
};

export default BackgroundAnimation;
