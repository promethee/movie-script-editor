interface FontSizeControlProps {
  fontSize: number;
  onChange: (size: number) => void;
}

export function FontSizeControl({ fontSize, onChange }: FontSizeControlProps) {
  return (
    <div className="flex items-center gap-1 text-neutral-400">
      <button
        onClick={() => onChange(fontSize - 1)}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 hover:text-neutral-200"
        aria-label="Decrease font size">
        −
      </button>
      <span className="w-6 text-center text-[11px] tabular-nums">
        {fontSize}
      </span>
      <button
        onClick={() => onChange(fontSize + 1)}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 hover:text-neutral-200"
        aria-label="Increase font size">
        +
      </button>
    </div>
  );
}
