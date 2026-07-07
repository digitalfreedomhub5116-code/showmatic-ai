import { cn } from '@/lib/utils';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export function ShowmaticLogo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6.8C9 6.1 9.75 5.7 10.34 6.03L17.39 10.03C17.98 10.37 17.98 11.23 17.39 11.57L10.34 15.57C9.75 15.9 9 15.5 9 14.8V6.8Z"
            fill="white"
          />
          <path
            d="M6 17.5C6 17.5 7.5 19 12 19C16.5 19 18 17.5 18 17.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-bold tracking-tight text-foreground">
            Showmatic<span className="text-violet-600">.ai</span>
          </div>
          <div className="text-xs text-muted-foreground">SaaS videos, made simple.</div>
        </div>
      )}
      {compact && (
        <div className="text-lg font-bold tracking-tight text-foreground">
          Showmatic<span className="text-violet-600">.ai</span>
        </div>
      )}
    </div>
  );
}
