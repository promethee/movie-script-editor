import { useState, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ViewToggle } from './components/ViewToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useDocument } from './state/documentStore';
import { useFountainFile } from './hooks/useFountainFile';
import { useSettings } from './hooks/useSettings';
import { FontSizeControl } from './components/FontSizeControl';

type ViewMode = 'write' | 'preview' | 'split';

export default function App() {
  // --- state hooks ---
  const {
    content,
    filePath,
    isDirty,
    updateContent,
    markSaved,
    setContent,
    resetDocument,
  } = useDocument();
  const { openFile, saveFile, saveFileAs } = useFountainFile({
    content,
    filePath,
    setContent,
    markSaved,
  });
  const {
    theme,
    lastView,
    lastFilePath,
    setTheme,
    setLastView,
    setLastFilePath,
    draftContent,
    draftIsDirty,
    setDraft,
    fontSize,
    setFontSize,
  } = useSettings();
  const [mode, setModeState] = useState<ViewMode>(lastView);

  // --- derived actions ---
  const setMode = (m: ViewMode) => {
    setModeState(m);
    setLastView(m);
  };

  const newFile = useCallback(async () => {
    const proceed = await window.api.checkUnsavedAndNew(isDirty);
    if (proceed) {
      resetDocument();
      setLastFilePath(null);
      setDraft(null, false);
    }
  }, [isDirty, resetDocument, setLastFilePath, setDraft]);

  // --- effects ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.api.onMenuNew(newFile);
    window.api.onMenuOpen(openFile);
    window.api.onMenuSave(saveFile);
    window.api.onMenuSaveAs(saveFileAs);

    return () => {
      window.api.removeMenuListeners();
    };
  }, [newFile, openFile, saveFile, saveFileAs]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (cmdOrCtrl && e.key === 'n') {
        e.preventDefault();
        newFile();
      }
      if (cmdOrCtrl && e.key === 'o') {
        e.preventDefault();
        openFile();
      }
      if (cmdOrCtrl && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        saveFile();
      }
      if (cmdOrCtrl && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        saveFileAs();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [newFile, openFile, saveFile, saveFileAs]);

  // Restore on launch: prefer unsaved draft over last saved file
  useEffect(() => {
    if (draftIsDirty && draftContent !== null) {
      setContent(draftContent);
      // don't call markSaved — keep isDirty true, no filePath assumed
      return;
    }
    if (lastFilePath) {
      window.api.readPath(lastFilePath).then((result) => {
        if (result) {
          setContent(result.content);
          markSaved(result.filePath);
        } else {
          setLastFilePath(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft on every change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDraft(isDirty ? content : null, isDirty);
    }, 300);
    return () => clearTimeout(timeout);
  }, [content, isDirty]);

  // Clear draft once saved
  useEffect(() => {
    if (!isDirty) setDraft(null, false);
  }, [isDirty]);

  // --- render ---
  return (
    <div className="h-screen w-screen flex flex-col bg-chrome">
      <div className="flex justify-between items-center px-4 h-11 border-b border-black/30 text-xs text-neutral-400">
        <ViewToggle mode={mode} onChange={setMode} />
        <div className="flex items-center gap-3">
          <span>
            {filePath ? filePath.split(/[\\/]/).pop() : 'Untitled'}
            {isDirty ? ' •' : ''}
          </span>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {(mode === 'write' || mode === 'split') && (
          <div className={mode === 'split' ? 'w-1/2 h-full' : 'w-full h-full'}>
            <Editor
              content={content}
              onChange={updateContent}
              fontSize={fontSize}
            />{' '}
          </div>
        )}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={
              mode === 'split'
                ? 'w-1/2 h-full border-l border-neutral-800'
                : 'w-full h-full'
            }>
            <Preview content={content} fontSize={fontSize} />{' '}
          </div>
        )}
      </div>
    </div>
  );
}
