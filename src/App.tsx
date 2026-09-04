import { useState, useEffect, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ViewToggle } from './components/ViewToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useDocument } from './state/documentStore';
import { useFountainFile } from './hooks/useFountainFile';
import { useSettings } from './hooks/useSettings';
import { FontSizeControl } from './components/FontSizeControl';
import { AppMenu } from './components/AppMenu';
import { parseFountain } from './fountain/parse';

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
    autosaveEnabled,
    setAutosaveEnabled,
  } = useSettings();
  const [mode, setModeState] = useState<ViewMode>(lastView);

  const [justAutosaved, setJustAutosaved] = useState(false);

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
      setAutosaveEnabled(false);
    }
  }, [isDirty, resetDocument, setLastFilePath, setDraft, setAutosaveEnabled]);

  const exportPdf = useCallback(async () => {
    const { html, titlePageHtml, title } = parseFountain(content);
    const suggestedName = (
      title ||
      filePath
        ?.split(/[\\/]/)
        .pop()
        ?.replace(/\.fountain$/, '') ||
      'Untitled'
    ).replace(/[\\/:*?"<>|]/g, ''); // strip characters invalid in filenames
    await window.api.exportPdf({
      titlePageHtml,
      scriptHtml: html,
      suggestedName,
    });
  }, [content, filePath]);

  const menuGroups = [
    {
      label: 'File',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
          <path
            d="M5 2.5h6.5L15 6v11a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-14a.5.5 0 0 1 .5-.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 2.5V6H15"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ),
      items: [
        { label: 'New', onClick: newFile, shortcut: 'Ctrl+N' },
        { label: 'Open...', onClick: openFile, shortcut: 'Ctrl+O' },
        { label: 'Save', onClick: saveFile, shortcut: 'Ctrl+S' },
        { label: 'Save As...', onClick: saveFileAs, shortcut: 'Ctrl+Shift+S' },
        { label: 'Export to PDF...', onClick: exportPdf },
      ],
    },
  ];

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
      if (cmdOrCtrl && e.key === 'Tab') {
        e.preventDefault();
        const order: ViewMode[] = ['write', 'preview', 'split'];
        const next = order[(order.indexOf(mode) + 1) % order.length];
        setMode(next);
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

  useEffect(() => {
    if (filePath) setLastFilePath(filePath);
  }, [filePath]);

  useEffect(() => {
    if (!autosaveEnabled || !filePath || !isDirty) return;
    const timeout = setTimeout(async () => {
      await window.api.saveFile(filePath, content);
      markSaved(filePath);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [content, filePath, isDirty, autosaveEnabled, markSaved]);

  useEffect(() => {
    if (!autosaveEnabled || !filePath || !isDirty) return;
    const timeout = setTimeout(async () => {
      await window.api.saveFile(filePath, content);
      markSaved(filePath);
      setJustAutosaved(true);
      setTimeout(() => setJustAutosaved(false), 1200);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [content, filePath, isDirty, autosaveEnabled, markSaved]);

  // --- render ---
  return (
    <div className="h-screen w-screen flex flex-col bg-chrome">
      <div className="grid grid-cols-3 items-center px-3 h-11 border-b border-black/30 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <AppMenu groups={menuGroups} />
          <label
            className={`flex items-center gap-1.5 text-xs select-none ${
              filePath
                ? 'text-neutral-400 cursor-pointer'
                : 'text-neutral-700 cursor-not-allowed'
            }`}>
            <input
              type="checkbox"
              checked={autosaveEnabled}
              disabled={!filePath}
              onChange={(e) => setAutosaveEnabled(e.target.checked)}
              className="accent-neutral-400 disabled:opacity-40"
            />
            {justAutosaved ? 'Autosave!' : 'Autosave'}
          </label>
        </div>

        <div className="flex items-center justify-center gap-2">
          {' '}
          <ViewToggle mode={mode} onChange={setMode} />
          <span className="text-[10px] text-neutral-400 leading-none">
            Ctrl+Tab
          </span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span>
            {filePath ? filePath.split(/[\\/]/).pop() : 'Untitled'}
            {isDirty ? ' •' : ''}
          </span>
          <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
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
