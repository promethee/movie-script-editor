# AGENTS.md — Fountain Script Editor

## Project

Distraction-free desktop app for writing movie scripts in Fountain format.
Stack: Electron + React + TypeScript + Vite + Tailwind CSS.

## Core Principles

- Distraction-free = single-pane editor with live formatting, no split preview panel.
- Simplicity for the end user: install and start writing immediately, no setup screens.
- Rely on existing libraries (e.g. `fountain-js`) for Fountain parsing — no custom parser.
- Files are plain `.fountain` text files on disk — no proprietary format, no DB.

## Architecture

- Electron main process: window management, file system (open/save/save-as), native menus.
- Renderer (React + TS): editor component, live-formatting engine, minimal chrome.
- Parsing: `fountain-js` (or equivalent) run on debounce to detect element types
  (scene heading, action, character, dialogue, parenthetical, transition) for styling only —
  do not convert text to a different in-memory model that could lose user's raw syntax.
- Persistence: raw text is the source of truth. Save writes raw text directly to `.fountain` file.

## Coding Conventions

- TypeScript strict mode.
- Functional React components, hooks only.
- Keep main/renderer process boundary clean — no direct Node APIs in renderer (use IPC/preload).
- No unnecessary state managers for MVP; use React state/context unless complexity demands Redux Toolkit.

## Non-Goals (MVP)

- No cloud sync, no accounts.
- No collaborative editing.
- No PDF/export beyond plain .fountain (may come later).
- No custom Fountain parser.

## Agent Working Rules

- Before adding a dependency, check if it duplicates existing functionality.
- Never introduce a split raw/preview pane — this contradicts the distraction-free requirement.
- When implementing formatting, prefer restyling the existing text (CSS/decoration) over re-rendering into a different DOM structure, to avoid cursor position bugs.
- Update TODO.md when a task is completed or a new task is discovered.
