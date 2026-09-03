interface EditorProps {
  content: string;
  onChange: (text: string) => void;
  fontSize: number;
}

export function Editor({ content, onChange, fontSize }: EditorProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-800 flex justify-center">
      <textarea
        className="w-full max-w-[680px] min-h-full resize-none outline-none
                   bg-[var(--page)] text-[var(--ink)] font-mono
                   px-14 py-16 my-8 rounded-sm shadow-sm"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="FADE IN:"
      />
    </div>
  );
}
