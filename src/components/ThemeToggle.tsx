interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-colors"
      aria-label="Toggle theme">
      {theme === 'dark' ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5A.75.75 0 0 1 10 17.5Zm0-16a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5A.75.75 0 0 1 10 1.5Zm8.5 8.5a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM2.75 10.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 0 1.5Zm12.9-5.4a.75.75 0 0 1 0 1.06l-.36.36a.75.75 0 1 1-1.06-1.06l.36-.36a.75.75 0 0 1 1.06 0Zm-10.9 10.9a.75.75 0 0 1 0 1.06l-.36.36a.75.75 0 1 1-1.06-1.06l.36-.36a.75.75 0 0 1 1.06 0Zm10.9 1.06a.75.75 0 0 1-1.06 0l-.36-.36a.75.75 0 1 1 1.06-1.06l.36.36a.75.75 0 0 1 0 1.06ZM5.81 5.81a.75.75 0 0 1-1.06 0l-.36-.36a.75.75 0 0 1 1.06-1.06l.36.36a.75.75 0 0 1 0 1.06Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M17.5 12.5a7.5 7.5 0 0 1-9.9-9.9A8 8 0 1 0 17.5 12.5Z" />
        </svg>
      )}
    </button>
  );
}
