export function MenuStackLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path d="M7 10.5H25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 16H25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 21.5H16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22.5" cy="21.5" r="3.5" fill="white" />
      <path d="M21 21.5H24" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22.5 20V23" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
