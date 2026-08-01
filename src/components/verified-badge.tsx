import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: number;
  showText?: boolean;
}

export function VerifiedBadge({ size = 16, showText = true }: VerifiedBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[#1E5AA8] bg-[#1E5AA8]/10 px-2 py-0.5 rounded-full text-xs font-medium"
      title="CNIC Verified Worker"
    >
      <CheckCircle2 size={size} className="text-[#1E5AA8] fill-[#1E5AA8] stroke-white" />
      {showText && <span>Verified</span>}
    </span>
  );
}
