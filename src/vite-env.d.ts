interface Window {
  api: {
    readPath: (
      filePath: string,
    ) => Promise<{ filePath: string; content: string } | null>;
    openFile: () => Promise<{ filePath: string; content: string } | null>;
    saveFile: (filePath: string, content: string) => Promise<boolean>;
    saveFileAs: (content: string) => Promise<string | null>;

    onMenuOpen: (cb: () => void) => void;
    onMenuSave: (cb: () => void) => void;
    onMenuSaveAs: (cb: () => void) => void;

    onMenuNew: (cb: () => void) => void;
    checkUnsavedAndNew: (isDirty: boolean) => Promise<boolean>;
    removeMenuListeners: () => void;
  };
}
