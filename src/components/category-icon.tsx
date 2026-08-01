import {
  Zap,
  Wrench,
  Wind,
  Hammer,
  Scissors,
  BookOpen,
  Car,
  Sparkles,
  Paintbrush,
  Feather,
  Utensils,
  Briefcase,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Lightning: Zap,
  Wrench,
  Plumber: Wrench,
  Wind,
  Snowflake: Wind,
  Hammer,
  Carpenter: Hammer,
  Scissors,
  Tailor: Scissors,
  BookOpen,
  Book: BookOpen,
  Tutor: BookOpen,
  Car,
  Driver: Car,
  Sparkles,
  Palette: Sparkles,
  'Makeup Artist': Sparkles,
  Paintbrush,
  Painter: Paintbrush,
  Feather,
  Brush: Feather,
  'Mehndi Artist': Feather,
  Utensils,
  'Home Cook': Utensils,
};

interface CategoryIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ name, size = 20, className = '' }: CategoryIconProps) {
  const IconComponent = ICON_MAP[name] || Briefcase;
  return <IconComponent size={size} className={className} />;
}
