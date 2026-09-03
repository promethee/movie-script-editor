import { useCallback } from 'react';

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
  const openFile = useCallback(async () => {
    const result = await window.api.openFile();
    if (!result) return;
    setContent(result.content);
    markSaved(result.filePath);
  }, [setContent, markSaved]);

  const saveFile = useCallback(async () => {
    if (filePath) {
      await window.api.saveFile(filePath, content);
      markSaved(filePath);
    } else {
      const newPath = await window.api.saveFileAs(content);
      if (newPath) markSaved(newPath);
    }
  }, [filePath, content, markSaved]);

  const saveFileAs = useCallback(async () => {
    const newPath = await window.api.saveFileAs(content);
    if (newPath) markSaved(newPath);
  }, [content, markSaved]);

  return { openFile, saveFile, saveFileAs };
}
