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
- [x] Confirm before quit if there are unsaved changes (native dialog, intercepts window close)
- [x] Handle file already-open-elsewhere / external changes (fs.watch, own-write suppression, reload/keep confirm dialog)

## 4. Distraction-Free Chrome

- [x] Minimal window, full-window editor, generous margins
- [x] Light/dark theme toggle
- [x] Persist settings (theme, last view mode, font size) via localStorage
- [x] Hide window until ready-to-show (avoid blank-window flash)
- [x] Font size setting (adjustable, clamped 10–24px, persisted)
- [x] In-app File menu replacing native OS menu bar (Win/Linux), native menu kept on macOS
- [x] Ctrl+Tab shortcut to cycle Write/Preview/Split, with on-screen hint
- [x] Full theme-variable system (--page, --ink, --surface, --chrome, --border, --text-muted/faint) so light/dark themes are consistent across the entire UI, not just the writing page
- [x] Theme-aware thin scrollbars

## 5. Packaging & Onboarding

- [x] electron-builder config (win/mac/linux, output separated to release/)
- [x] Windows installer builds and launches successfully
- [x] macOS (dmg) and Linux (AppImage) packaging targets — built successfully via CI (untested on those OSes directly)
- [x] GitHub Actions release pipeline — fully working end-to-end after fixing: Node version (jsdom compat), missing cpy/copyfiles dependency, electron-builder schema changes (syncDesktopName/desktopName not in v26), GITHUB_TOKEN permissions (403), artifact glob brace-expansion
- [x] App icon + branding (custom SVG → PNG → .ico/.icns/.png via electron-icon-maker)
- [x] README with install instructions, unsigned-build notice, test coverage transparency
- [x] GitHub Pages landing site
- [x] v1.0.0 tagged and released — Windows build verified working

## 6. Polish / Post-MVP (backlog, not blocking)

- [x] Export to PDF (title page from Fountain metadata, suggested filename from script title, standard screenplay margins/formatting)
- [x] Autosave — opt-in checkbox in toolbar, disabled until file is saved once, debounced 2.5s writes, resets off on New/Open, "Autosave!" flash confirmation
- [x] Screenplay stats — word count, scene count, estimated pages/runtime, shown in a dedicated row below the toolbar
- [x] Find/search in Write view (Ctrl+F) — substring match, next/prev navigation, live match count, scoped to editor only (not Preview)
- [ ] Scene navigator sidebar — descoped in favor of search

## 7. Testing

- [x] Vitest + Testing Library setup (jsdom environment)
- [x] Unit tests: parseFountain (title extraction, scene heading/transition HTML, empty input, title-page separation)
- [x] Unit tests: useDocument (dirty state, markSaved, resetDocument)
- [x] Unit tests: useSettings (defaults, persistence, fontSize clamping)
- [x] Unit tests: useFountainFile (mocked window.api — open/save/saveAs, cancelled dialogs, ref-based stale-closure guard)
- [x] E2E setup (Playwright + Electron, isolated user-data-dir per test)
- [x] E2E: blank editor on launch, draft persistence across restart, preview rendering, theme persistence
- [x] Native-menu e2e tests — descoped: Playwright can't drive real OS menu clicks; would only test the IPC handler, not the actual click path (documented in README's Test Coverage section)
