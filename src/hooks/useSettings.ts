import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ViewMode = 'write' | 'preview' | 'split';

interface Settings {
  theme: Theme;
  lastView: ViewMode;
  lastFilePath: string | null;
  draftContent: string | null; // unsaved content snapshot
  draftIsDirty: boolean;
}

const KEY = 'fountain-editor-settings';
const DEFAULTS: Settings = {
  theme: 'dark',
  lastView: 'write',
  lastFilePath: null,
  draftContent: null,
  draftIsDirty: false,
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const setTheme = (theme: Theme) => setSettings((s) => ({ ...s, theme }));
  const setLastView = (lastView: ViewMode) =>
    setSettings((s) => ({ ...s, lastView }));

  const setLastFilePath = (lastFilePath: string | null) =>
    setSettings((s) => ({ ...s, lastFilePath }));

  const setDraft = (draftContent: string | null, draftIsDirty: boolean) =>
    setSettings((s) => ({ ...s, draftContent, draftIsDirty }));

  return {
    theme: settings.theme,
    lastView: settings.lastView,
    lastFilePath: settings.lastFilePath,
    draftContent: settings.draftContent,
    draftIsDirty: settings.draftIsDirty,
    setTheme,
    setLastView,
    setLastFilePath,
    setDraft,
  };
}
