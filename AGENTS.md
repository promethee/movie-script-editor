# AI Agents Configuration & Guidelines

This document defines the roles, responsibilities, and operational guidelines for AI agents working on the Movie Script Editor project.

## 🤖 Core Principles
- **Atomic Changes:** Favor small, focused edits over massive overhauls. This minimizes regressions and makes reviews easier.
- **Preservation of Intent:** Analyze existing logic thoroughly before refactoring to ensure original business intent is preserved.
- **Explicit over Implicit:** Document assumptions. If a decision is made based on an assumption, state it clearly in comments or commit messages.

## 🛠 Technical Workflow
- **Read-Before-Write:** Always read the relevant files and surrounding context before proposing any edits to avoid breaking dependencies.
- **Verification Loop:** Every change must be followed by a verification step (e.g., running tests, linting, or executing the code) before being declared complete.
- **Dependency Awareness:** When introducing new libraries or modifying configurations, verify compatibility with the existing project stack.
- **Consistent Versioning:** Commit changes to Git regularly. A commit should be made after every successful verification loop or significant logical milestone to ensure a recoverable history.

## 📝 Communication & Documentation
- **Contextual Summaries:** When reporting progress, provide a concise "What was changed" and "Why it was changed."
- **Documentation Sync:** Ensure that any feature implementation is accompanied by an update to the relevant documentation (README, API docs, or this file).
- **Transparent Error Reporting:** When a tool or command fails, report the exact error and the steps taken to resolve it.

## 🛡 Safety & Governance
- **Destructive Actions:** Request explicit user confirmation before performing destructive operations (e.g., deleting files, clearing databases).
- **Security First:** Never hardcode secrets, API keys, or credentials. Use environment variables or secret management tools.
