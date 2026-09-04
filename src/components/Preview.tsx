import { useEffect, useState } from 'react';
import { parseFountain } from '../fountain/parse';

interface PreviewProps {
  content: string;
  fontSize: number;
}

export function Preview({ content, fontSize }: PreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { html: parsedHtml } = parseFountain(content);
      setHtml(parsedHtml);
    }, 200);
    return () => clearTimeout(timeout);
  }, [content]);

  return (
    <div className="w-full h-full bg-[var(--surface)] flex justify-center overflow-hidden py-8">
      <div
        className="screenplay w-full max-w-[680px] h-full overflow-y-auto
               bg-[var(--page)] text-[var(--ink)] px-14 py-16 rounded-sm shadow-sm"
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
