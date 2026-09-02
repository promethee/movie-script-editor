# TODO — Fountain Script Editor

## 0. Project Setup

- [x] Init Electron + Vite + React + TS template
- [ ] Add Tailwind CSS
- [ ] Configure electron-builder for packaging (Mac/Win/Linux)
- [ ] Set up preload script + IPC boundary (contextIsolation on)

## 1. Fountain Parsing

- [x] Add `fountain-js` (or chosen lib) dependency
- [ ] Verify parser output shape (tokens/elements with type + range)
- [ ] Write thin wrapper module `src/fountain/parse.ts` around the lib

## 2. Editor Core (single-pane, live formatting)

- [ ] Choose text editing base (contenteditable vs CodeMirror/Monaco headless)
- [ ] Implement debounce parse-on-type (~150–300ms)
- [ ] Map parsed element types to CSS classes (scene heading, character, dialogue, etc.)
- [ ] Apply styling without losing cursor position/selection
- [ ] Toggleable "raw view" (plain monospace, no styling) for troubleshooting

## 3. File Handling

- [ ] New file (blank .fountain buffer)
- [ ] Open file (native dialog, read .fountain as plain text)
- [ ] Save / Save As (write plain text back to disk)
- [ ] Track dirty state (unsaved changes indicator)
- [ ] Handle file already-open-elsewhere / external changes (basic conflict warning)

## 4. Distraction-Free Chrome

- [ ] Minimal window: no visible toolbar by default
- [ ] Full-window editor, generous margins, single font
- [ ] Optional: hide OS menu bar / fullscreen "focus mode" toggle
- [ ] Basic settings: font size, theme (light/dark)

## 5. Packaging & Onboarding

- [ ] App icon + basic branding
- [ ] First-run experience: opens straight to blank editor (no login/setup wizard)
- [ ] Installers for target OS(es)
- [ ] Basic README with install instructions

## 6. Polish / Post-MVP (backlog, not blocking)

- [ ] Export to PDF
- [ ] Autosave
- [ ] Scene navigator sidebar (optional, toggle-only — must not break distraction-free default)
- [ ] Keyboard shortcuts cheat sheet
