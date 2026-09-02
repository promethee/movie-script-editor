interface Window {
  api: {
    openFile: () => Promise<{ filePath: string; content: string } | null>;
    saveFile: (filePath: string, content: string) => Promise<boolean>;
    saveFileAs: (content: string) => Promise<string | null>;
  };
}
