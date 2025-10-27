import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Target, Heart } from 'lucide-react';

const modes = [
  {
    key: 'calm',
    title: 'Calm',
    desc: 'Gentle breathing to unwind and soften the mind.',
    color: '#A8CABA',
    Icon: Moon,
  },
  {
    key: 'focus',
    title: 'Focus',
    desc: 'Single-point attention to steady your awareness.',
    color: '#E6E6E6',
    Icon: Target,
  },
  {
    key: 'gratitude',
    title: 'Gratitude',
    desc: 'Recall and savor what anchors you with warmth.',
    color: '#F4EDE4',
    Icon: Heart,
  },
];

const ModeSelector = ({ onSelect }) => {
  const [active, setActive] = useState('calm');

  const handleSelect = (key) => {
    setActive(key);
    onSelect?.(key);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {modes.map(({ key, title, desc, color, Icon }) => (
        <motion.button
          key={key}
          onClick={() => handleSelect(key)}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`text-left rounded-2xl p-5 shadow-sm transition-colors border ${
            active === key ? 'border-white/20 bg-white/5' : 'border-white/10 bg-white/[0.03]'
          }`}
          style={{ backdropFilter: 'blur(6px)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: `${color}22` }}
            >
              <Icon size={20} color={color} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/70">{desc}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ModeSelector;
