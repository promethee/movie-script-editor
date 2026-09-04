import { forwardRef } from 'react';

interface EditorProps {
  content: string;
  onChange: (text: string) => void;
  fontSize: number;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  function Editor({ content, onChange, fontSize }, ref) {
    return (
      <div className="w-full h-full bg-[var(--surface)] flex justify-center overflow-hidden py-8">
        <textarea
          ref={ref}
          className="w-full max-w-[680px] h-full overflow-y-auto resize-none outline-none
                     bg-[var(--page)] text-[var(--ink)] font-mono px-14 py-16 rounded-sm shadow-sm"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="FADE IN:"
        />
      </div>
    );
  },
);
