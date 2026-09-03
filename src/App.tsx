import { useState, useEffect } from 'react';
import { useSettings } from './hooks/useSettings';

import { ThemeToggle } from './components/ThemeToggle';

import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ViewToggle } from './components/ViewToggle';
import { useDocument } from './state/documentStore';
import { useFountainFile } from './hooks/useFountainFile';

type ViewMode = 'write' | 'preview' | 'split';

export default function App() {
  const { content, filePath, isDirty, updateContent, markSaved, setContent } =
    useDocument();
  const { openFile, saveFile, saveFileAs } = useFountainFile({
    content,
    filePath,
    setContent,
    markSaved,
  });
  const { theme, lastView, setTheme, setLastView } = useSettings();

  const setMode = (m: ViewMode) => {
    setModeState(m);
    setLastView(m);
  };
  const [mode, setModeState] = useState<ViewMode>(lastView);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.api.onMenuOpen(openFile);
    window.api.onMenuSave(saveFile);
    window.api.onMenuSaveAs(saveFileAs);

    return () => {
      window.api.removeMenuListeners();
    };
  }, [openFile, saveFile, saveFileAs]);

  return (
    <div className="h-screen w-screen flex flex-col bg-chrome">
      <div className="flex justify-between items-center px-4 h-11 border-b border-black/30 text-xs text-neutral-400">
        <ViewToggle mode={mode} onChange={setMode} />
        <div className="flex items-center gap-3">
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
        <span>
          {filePath ? filePath.split(/[\\/]/).pop() : 'Untitled'}
          {isDirty ? ' •' : ''}
        </span>
      </div>
      <div className="flex-1 flex overflow-hidden bg-neutral-800">
        {(mode === 'write' || mode === 'split') && (
          <div className={mode === 'split' ? 'w-1/2 h-full' : 'w-full h-full'}>
            <Editor content={content} onChange={updateContent} />
          </div>
        )}
        {(mode === 'preview' || mode === 'split') && (
          <div className={mode === 'split' ? 'w-1/2 h-full' : 'w-full h-full'}>
            <Preview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
