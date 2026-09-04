import { useEffect, useRef, useState, useMemo } from 'react';

interface SearchBarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  content: string;
  onClose: () => void;
}

export function SearchBar({ textareaRef, content, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [matchIndex, setMatchIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    if (!query) return [];
    const result: number[] = [];
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let idx = lowerContent.indexOf(lowerQuery);
    while (idx !== -1) {
      result.push(idx);
      idx = lowerContent.indexOf(lowerQuery, idx + 1);
    }
    return result;
  }, [query, content]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setMatchIndex(0);
  }, [query]);

  const jumpTo = (index: number) => {
    if (matches.length === 0) return;
    const wrapped =
      ((index % matches.length) + matches.length) % matches.length;
    setMatchIndex(wrapped);
    const start = matches[wrapped];
    const end = start + query.length;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(start, end);
      const lineHeight = parseFloat(
        getComputedStyle(textarea).lineHeight || '20',
      );
      const linesBefore = content.slice(0, start).split('\n').length;
      textarea.scrollTop = Math.max(0, (linesBefore - 5) * lineHeight);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      jumpTo(e.shiftKey ? matchIndex - 1 : matchIndex + 1);
    }
  };

  return (
    <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-md shadow-lg px-2 py-1.5">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Find..."
        className="bg-transparent outline-none text-xs text-neutral-200 w-40 placeholder-neutral-600"
      />
      <span className="text-[10px] text-neutral-500 tabular-nums w-12 text-center">
        {matches.length > 0 ? `${matchIndex + 1}/${matches.length}` : '0/0'}
      </span>
      <button
        onClick={() => jumpTo(matchIndex - 1)}
        className="text-neutral-500 hover:text-neutral-200 px-1"
        aria-label="Previous match">
        ↑
      </button>
      <button
        onClick={() => jumpTo(matchIndex + 1)}
        className="text-neutral-500 hover:text-neutral-200 px-1"
        aria-label="Next match">
        ↓
      </button>
      <button
        onClick={onClose}
        className="text-neutral-500 hover:text-neutral-200 px-1"
        aria-label="Close search">
        ✕
      </button>
    </div>
  );
}
