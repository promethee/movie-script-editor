type ViewMode = 'write' | 'preview' | 'split';

const OPTIONS: { mode: ViewMode; label: string; icon: JSX.Element }[] = [
  {
    mode: 'write',
    label: 'Write',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
        <path
          d="M14.5 2.5a1.5 1.5 0 0 1 2.12 2.12L6 15.24 2.5 16l.76-3.5L13.88 2.88a1.5 1.5 0 0 1 .62-.38Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    mode: 'preview',
    label: 'Preview',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
        <path
          d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="10"
          cy="10"
          r="2.1"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    mode: 'split',
    label: 'Split',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
        <rect
          x="2.5"
          y="3.5"
          width="15"
          height="13"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="10"
          y1="3.5"
          x2="10"
          y2="16.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
];

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  const activeIndex = OPTIONS.findIndex((o) => o.mode === mode);

  return (
    <div className="relative inline-flex bg-neutral-900/60 backdrop-blur-sm rounded-full p-1 shadow-inner shadow-black/20 ring-1 ring-white/5">
      <div
        className="absolute top-1 bottom-1 left-1 rounded-full bg-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-300"
        style={{
          width: `calc((100% - 0.5rem) / 3)`,
          transform: `translateX(${activeIndex * 100}%)`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      {OPTIONS.map((opt) => (
        <button
          key={opt.mode}
          onClick={() => onChange(opt.mode)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full
            text-[11px] font-medium tracking-wide transition-colors duration-200 active:scale-[0.97]
            ${mode === opt.mode ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'}`}>
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
