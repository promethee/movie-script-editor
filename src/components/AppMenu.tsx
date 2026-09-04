import { useState, useRef, useEffect, ReactNode } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
  shortcut?: string;
}

interface MenuGroup {
  label: string;
  icon?: ReactNode;
  items: MenuItem[];
}

interface AppMenuProps {
  groups: MenuGroup[];
}

export function AppMenu({ groups }: AppMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpenIndex(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-0.5 text-xs text-neutral-400">
      {groups.map((group, i) => (
        <div key={group.label} className="relative">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              openIndex === i
                ? 'bg-white/10 text-neutral-100'
                : 'hover:bg-white/5 hover:text-neutral-200'
            }`}>
            {group.icon}
            {group.label}
          </button>
          {openIndex === i && (
            <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-neutral-900 border border-white/10 rounded-md shadow-lg py-1 z-50">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpenIndex(null);
                  }}
                  className="w-full flex justify-between items-center px-3 py-1.5 text-left text-neutral-300 hover:bg-white/10 hover:text-neutral-100">
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="text-neutral-500 text-[10px]">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
