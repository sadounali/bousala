import React from 'react';
import { motion } from 'motion/react';

interface CompassLogoProps {
  size?: number;
  animate?: boolean;
}

const SDG_COLORS = [
  '#e5243b', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21', '#26bde2', '#fcc30b', '#a21942',
  '#fd6925', '#dd1367', '#fd9d24', '#bf8b2e', '#3f7e44', '#0a97d9', '#56c02b', '#00689d', '#19486a'
];

export const CompassLogo: React.FC<CompassLogoProps> = ({ size = 32, animate = true }) => {
  const radius = 50;
  const strokeWidth = 12;
  const innerRadius = radius - strokeWidth / 2;
  const center = 50;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="drop-shadow-sm"
    >
      {/* SDG Color Ring segments */}
      <g>
        {SDG_COLORS.map((color, index) => {
          const segmentAngle = 360 / SDG_COLORS.length;
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          
          const x1 = center + innerRadius * Math.cos((Math.PI * (startAngle - 90)) / 180);
          const y1 = center + innerRadius * Math.sin((Math.PI * (startAngle - 90)) / 180);
          const x2 = center + innerRadius * Math.cos((Math.PI * (endAngle - 90)) / 180);
          const y2 = center + innerRadius * Math.sin((Math.PI * (endAngle - 90)) / 180);

          return (
            <path
              key={index}
              d={`M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </g>

      {/* Compass Body */}
      <circle 
        cx={center} 
        cy={center} 
        r={innerRadius - strokeWidth/2 - 2} 
        fill="transparent" 
        stroke="#1b365d" 
        strokeWidth="2"
      />

      {/* Degree Markers */}
      {[0, 90, 180, 270].map((angle) => (
        <line
          key={angle}
          x1={center + (innerRadius - 15) * Math.cos((Math.PI * (angle - 90)) / 180)}
          y1={center + (innerRadius - 15) * Math.sin((Math.PI * (angle - 90)) / 180)}
          x2={center + (innerRadius - 10) * Math.cos((Math.PI * (angle - 90)) / 180)}
          y2={center + (innerRadius - 10) * Math.sin((Math.PI * (angle - 90)) / 180)}
          stroke="#1b365d"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Central Pivot */}
      <circle cx={center} cy={center} r="3" fill="#1b365d" />

      {/* Animated Needle */}
      <motion.g
        animate={animate ? {
          rotate: 360,
        } : {}}
        transition={animate ? {
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        } : {}}
        initial={{ rotate: 0 }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {/* North Pointer (Oued Blue) */}
        <path
          d="M 50 20 L 54 50 L 46 50 Z"
          fill="#1b365d"
        />
        {/* South Pointer (Oued Gold) */}
        <path
          d="M 50 80 L 54 50 L 46 50 Z"
          fill="#c5a059"
        />
      </motion.g>
    </svg>
  );
};
