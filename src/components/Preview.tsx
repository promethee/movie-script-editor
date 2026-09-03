import { useEffect, useState } from 'react';
import { parseFountain } from '../fountain/parse';

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { html: parsedHtml } = parseFountain(content);
      setHtml(parsedHtml);
    }, 200);
    return () => clearTimeout(timeout);
  }, [content]);

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral-800 flex justify-center">
      <div
        className="screenplay w-full max-w-[680px] bg-[var(--page)] text-[var(--ink)] px-14 py-16 my-8 rounded-sm shadow-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
