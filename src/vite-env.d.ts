interface Window {
  api: {
    openFile: () => Promise<{ filePath: string; content: string } | null>;
    saveFile: (filePath: string, content: string) => Promise<boolean>;
    saveFileAs: (content: string) => Promise<string | null>;

    onMenuOpen: (cb: () => void) => void;
    onMenuSave: (cb: () => void) => void;
    onMenuSaveAs: (cb: () => void) => void;

    removeMenuListeners: () => void;
  };
}
