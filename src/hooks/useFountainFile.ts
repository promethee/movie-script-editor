import { useCallback, useRef, useEffect } from 'react';

interface UseFountainFileArgs {
  content: string;
  filePath: string | null;
  setContent: (text: string) => void;
  markSaved: (path: string) => void;
}

export function useFountainFile({
  content,
  filePath,
  setContent,
  markSaved,
}: UseFountainFileArgs) {
  // Refs let the callbacks below stay stable across renders
  // while still reading the latest content/filePath when invoked.
  const contentRef = useRef(content);
  const filePathRef = useRef(filePath);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  useEffect(() => {
    filePathRef.current = filePath;
  }, [filePath]);

  const openFile = useCallback(async () => {
    const result = await window.api.openFile();
    if (!result) return;
    setContent(result.content);
    markSaved(result.filePath);
  }, [setContent, markSaved]);

  const saveFile = useCallback(async () => {
    if (filePathRef.current) {
      await window.api.saveFile(filePathRef.current, contentRef.current);
      markSaved(filePathRef.current);
    } else {
      const newPath = await window.api.saveFileAs(contentRef.current);
      if (newPath) markSaved(newPath);
    }
  }, [markSaved]);

  const saveFileAs = useCallback(async () => {
    const newPath = await window.api.saveFileAs(contentRef.current);
    if (newPath) markSaved(newPath);
  }, [markSaved]);

  return { openFile, saveFile, saveFileAs };
}
