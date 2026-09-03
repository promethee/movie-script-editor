## 0. Project Setup

- [x] Init Electron + Vite + React + TS template
- [x] Add Tailwind CSS (v4)
- [x] Set up preload script + IPC boundary (contextIsolation on)
- [ ] Configure electron-builder for packaging (in progress — build/output path conflict being debugged)

## 1. Fountain Parsing

- [x] Add `fountain-js` dependency
- [x] Verify parser output shape (`output.html.script`)
- [x] Write thin wrapper module `src/fountain/parse.ts`

## 2. Editor Core (textarea + separate preview)

- [x] Build `Editor.tsx`: plain `<textarea>`, monospace font, full-height
- [x] Debounce onChange -> `parseFountain()`
- [x] Build `Preview.tsx`: render `output.html.script`, styled per screenplay conventions
- [x] Build `ViewToggle.tsx`: Write / Preview / Split, polished segmented control
- [x] Split-view toggle (shared state)

## 3. File Handling

- [x] Open file (native dialog, IPC)
- [x] Save / Save As (IPC)
- [x] Track dirty state (unsaved changes indicator)
- [x] Native menu (File > Open/Save/Save As) + keyboard shortcuts, properly cleaned up on unmount
- [ ] New file action
- [ ] Handle file already-open-elsewhere / external changes

## 4. Distraction-Free Chrome

- [x] Minimal window, full-window editor, generous margins
- [x] Light/dark theme toggle
- [x] Persist settings (theme, last view mode) via localStorage
- [x] Hide window until ready-to-show (avoid blank-window flash)
- [ ] Font size setting
- [ ] Focus mode / hide menu bar toggle

## 5. Packaging & Onboarding

- [ ] electron-builder config (blocked — output dir conflict with Vite's dist/)
- [ ] App icon + branding
- [ ] First-run experience (already effectively true — opens straight to blank editor)
- [ ] Installers for target OS(es)
- [ ] Basic README with install instructions

## 6. Polish / Post-MVP (backlog, not blocking)

- [ ] Export to PDF
- [ ] Autosave
- [ ] Scene navigator sidebar (optional, toggle-only — must not break distraction-free default)
- [ ] Keyboard shortcuts cheat sheet
