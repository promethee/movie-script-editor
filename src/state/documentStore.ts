import { useState, useCallback } from 'react';

export function useDocument() {
  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateContent = useCallback((text: string) => {
    setContent(text);
    setIsDirty(true);
  }, []);

  const markSaved = useCallback((path: string) => {
    setFilePath(path);
    setIsDirty(false);
  }, []);

  return { content, filePath, isDirty, updateContent, markSaved, setContent };
}
