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

- [x] New file (blank .fountain buffer, with unsaved-changes confirm guard)
- [x] Open file (native dialog, IPC)
- [x] Save / Save As (IPC)
- [x] Track dirty state (unsaved changes indicator)
- [x] Native menu (File > New/Open/Save/Save As) + keyboard shortcuts, listeners cleaned up correctly
- [x] Restore last opened file on launch (via remembered path + IPC re-read)
- [x] Restore unsaved draft content on launch (persisted separately from saved-file path, cleared once saved)
- [ ] Handle file already-open-elsewhere / external changes

## 4. Distraction-Free Chrome

- [x] Minimal window, full-window editor, generous margins
- [x] Light/dark theme toggle
- [x] Persist settings (theme, last view mode, font size) via localStorage
- [x] Hide window until ready-to-show (avoid blank-window flash)
- [x] Font size setting (adjustable, clamped 10–24px, persisted)
- [ ] Focus mode / hide menu bar toggle

## 5. Packaging & Onboarding

- [x] electron-builder config (output separated to release/, main/preload compiled as .cjs to avoid ESM/CJS conflicts)
- [x] Windows installer builds and launches successfully
- [ ] App icon + branding
- [ ] macOS/Linux packaging targets (untested)
- [ ] Basic README with install instructions

## 6. Polish / Post-MVP (backlog, not blocking)

- [ ] Export to PDF
- [ ] Autosave
- [ ] Scene navigator sidebar (optional, toggle-only — must not break distraction-free default)
- [ ] Keyboard shortcuts cheat sheet

## 7. Testing

- [x] Vitest + Testing Library setup (jsdom environment)
- [x] Unit tests: parseFountain (title extraction, scene heading/transition HTML, empty input)
- [x] Unit tests: useDocument (dirty state, markSaved, resetDocument)
- [x] Unit tests: useSettings (defaults, persistence, fontSize clamping)
- [ ] Unit tests: useFountainFile (mock window.api, verify open/save/saveAs calls)
- [x] E2E setup (Playwright + Electron, isolated user-data-dir per test)
- [x] E2E: blank editor on launch, draft persistence across restart, preview rendering, theme persistence
- [ ] E2E: native menu actions (New/Open/Save/Save As) — needs IPC-driven trigger since Playwright can't click OS-native menus
