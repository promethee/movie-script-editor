import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ViewMode = 'write' | 'preview' | 'split';

interface Settings {
  theme: Theme;
  lastView: ViewMode;
}

const KEY = 'fountain-editor-settings';
const DEFAULTS: Settings = { theme: 'dark', lastView: 'write' };

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

  return {
    theme: settings.theme,
    lastView: settings.lastView,
    setTheme,
    setLastView,
  };
}
