import React from 'react';

interface MindfulistLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const MindfulistLogo: React.FC<MindfulistLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
}) => {
  const iconSizes = {
    sm: { width: 22, height: 26 },
    md: { width: 30, height: 34 },
    lg: { width: 40, height: 44 },
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const { width, height } = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Zen stone + list symbol matching exact screenshot brand mark */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 34 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="Mindfulist Logo"
      >
        {/* Top smooth rounded zen stone pebble */}
        <path
          d="M7 11.5C7 5.5 12 1 17 1C22 1 27 5.5 27 11.5C24 13.5 10 13.5 7 11.5Z"
          fill="#8CA390"
        />
        {/* Dot 1 */}
        <circle cx="4" cy="19" r="1.8" fill="#4A5568" />
        {/* Line 1 */}
        <rect x="9" y="17.6" width="23" height="2.8" rx="1.4" fill="#4A5568" />

        {/* Dot 2 */}
        <circle cx="4" cy="27" r="1.8" fill="#4A5568" />
        {/* Line 2 */}
        <rect x="9" y="25.6" width="23" height="2.8" rx="1.4" fill="#4A5568" />

        {/* Dot 3 */}
        <circle cx="4" cy="35" r="1.8" fill="#4A5568" />
        {/* Line 3 */}
        <rect x="9" y="33.6" width="23" height="2.8" rx="1.4" fill="#4A5568" />
      </svg>

      {showText && (
        <span
          className={`font-normal tracking-tight text-[#3A4540] ${textSizes[size]}`}
          style={{ letterSpacing: '-0.02em', fontWeight: 500 }}
        >
          Mindfulist
        </span>
      )}
    </div>
  );
};
