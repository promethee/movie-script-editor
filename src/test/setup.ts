import '@testing-library/jest-dom';

// Node 22+ ships an experimental global `localStorage` that requires a
// backing file and lacks a working API in this context. It shadows jsdom's
// version. Force our own in-memory implementation regardless of what's
// already defined.
const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  },
});
