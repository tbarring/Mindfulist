import React from 'react';
import { Home, GraduationCap, Building2, Sun, Moon, Heart, BookOpen, Sparkles, Dumbbell } from 'lucide-react';

interface CategoryIconProps {
  icon: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = '', size = 20 }) => {
  switch (icon) {
    case 'home':
      return <Home size={size} className={className} strokeWidth={1.8} />;
    case 'school':
      return <GraduationCap size={size} className={className} strokeWidth={1.8} />;
    case 'work':
      return <Building2 size={size} className={className} strokeWidth={1.8} />;
    case 'sun':
    case 'routine':
      return <Sun size={size} className={className} strokeWidth={1.8} />;
    case 'moon':
      return <Moon size={size} className={className} strokeWidth={1.8} />;
    case 'heart':
    case 'health':
      return <Heart size={size} className={className} strokeWidth={1.8} />;
    case 'book':
      return <BookOpen size={size} className={className} strokeWidth={1.8} />;
    case 'dumbbell':
      return <Dumbbell size={size} className={className} strokeWidth={1.8} />;
    case 'sparkles':
    case 'creative':
    default:
      return <Sparkles size={size} className={className} strokeWidth={1.8} />;
  }
};
