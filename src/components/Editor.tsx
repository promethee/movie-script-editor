interface EditorProps {
  content: string;
  onChange: (text: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-800 flex justify-center">
      <textarea
        className="w-full max-w-[680px] min-h-full resize-none outline-none
               bg-[var(--page)] text-[var(--ink)] font-mono text-[13px] leading-6
               px-14 py-16 my-8 rounded-sm shadow-sm placeholder-muted"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="FADE IN:"
      />
    </div>
  );
}
