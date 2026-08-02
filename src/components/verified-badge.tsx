import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: number;
  showText?: boolean;
}

export function VerifiedBadge({ size = 16, showText = true }: VerifiedBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[#1FB863] bg-[#D6F5E3] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#1FB863]/20"
      title="CNIC Verified Worker"
    >
      <CheckCircle2 size={size} className="text-[#1FB863] fill-[#1FB863] stroke-white" />
      {showText && <span>Verified</span>}
    </span>
  );
}
