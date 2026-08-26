// Line icons for the Learn app. 24px grid, 2px stroke, currentColor —
// so a single set works in the nav, on cards, and inside buttons.

type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const HomeIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
  </svg>
);

export const CoursesIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>
);

export const YouIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const SearchIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const FlameIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 2c.3 3-1.2 4.4-2.6 5.7C8.3 9.2 7 10.6 7 13.2A5.7 5.7 0 0 0 12.7 19a5.3 5.3 0 0 0 5.3-5.4c0-3.6-2.4-5.2-3.4-7.6-.4-1-.6-2.4-2.1-4z" />
  </svg>
);

export const BoltIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 3.5 13.2c-.4.5-.1 1.3.6 1.3H10l-1 7.5 9.5-11.2c.4-.5.1-1.3-.6-1.3H12z" />
  </svg>
);

export const CheckIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={3}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const LockIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <rect x="4" y="10" width="16" height="11" rx="3" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const MenuIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const SunIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const ChevronRight = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ChevronLeft = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const CloseIcon = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const StarIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z" />
  </svg>
);

export const TrophyIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
    <path d="M8 5H5.5a2.5 2.5 0 0 0 2.5 4M16 5h2.5a2.5 2.5 0 0 1-2.5 4" />
    <path d="M12 13v4M9 20h6" />
  </svg>
);
