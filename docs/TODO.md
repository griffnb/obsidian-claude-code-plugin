# Optimization & Roadmap

This document outlines planned optimizations and improvements for the Obsidian Claude Code Plugin to enhance maintainability, extensibility, and developer experience.

## 1. CI/CD: GitHub Actions

**Goal**: Automate testing, building, and releasing.

- **Why**: Manual releases are prone to errors. Automated checks ensure code quality.
- **Implementation**:
  - Create `.github/workflows/test.yml` for linting and type checking.
  - Create `.github/workflows/release.yml` to build `main.js`, `manifest.json`, and `styles.css` and attach them to GitHub Releases.
  - Reference: [Release your plugin with GitHub Actions](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions)

## 2. Better Testing

**GOAL**: Make testing not require obsidian to be active

- **Why**: Currently, testing requires obsidian to be active
- **Implementation**:
  - Install and setup Storybook to run the components in isolation

## 3. Abstract the UI

**Goal**: Abstract command line and UI integration to not even need obsidian to be active

- **Why**: Currently, the UI is tightly coupled to Obsidian's UI, The ui should be agnostic to where it is plugged in so that we can reuse this UI for other plugins/ systems
- **Implementation**:
  - Abstract the UI to be agnostic to where it is plugged in
  - Abstract the command line integration to be agnostic to where it is plugged in

## 4. Settings & Configuration Overhaul

**Goal**: Improve the settings UI and environment variable management.

- **Why**: Currently, path detection is basic, and environment variables (like API keys) are implicitly handled by the shell.
- **Implementation**:
  - **Env Var Management**: Add a UI to explicitly set environment variables (e.g., `ANTHROPIC_API_KEY`) that are passed to the child process, rather than relying on the system shell.
  - **Profiles**: Allow saving different configuration profiles (e.g., "Work", "Personal").
  - **Validation**: Add more robust path validation and version checking for the CLI tools.

## 5. CLI Abstraction Layer (Multi-Agent Support)

**Goal**: Decouple the runner from `claude` CLI to support other agents.

- **Why**: `ClaudeCodeRunner` is tightly coupled to Claude's specific output format and behavior. We may want to support other local agents or CLIs in the future.
- **Implementation**:
  - Create an interface `IAgentRunner`:
    ```typescript
    interface IAgentRunner {
      run(request: AgentRequest): Promise<AgentResponse>;
      stream(request: AgentRequest, onEvent: (event: AgentEvent) => void): void;
      abort(): void;
    }
    ```
  - Implement `ClaudeCodeRunner` implementing this interface.
  - Create a factory to instantiate the correct runner based on settings.
  - Standardize the event format (System, Assistant, Tool, Error) across different runners.

## 6. Tooling & Extensibility

**Goal**: Allow the plugin to easily integrate with other AI tools and workflows.

- **Why**: Users might want to chain Claude Code with other tools (e.g., a linter, a test runner) or use different "skills".
- **Implementation**:
  - **Tool Registry**: A system to register custom tools that Claude can "see" and execute (if the CLI supports it).
  - **Workflow Hooks**: Pre/post-run hooks (e.g., "Run linter after Claude edits a file").
  - **Slash Commands**: Implement slash commands in the chat interface to trigger specific workflows (e.g., `/fix`, `/test`).

## 7. Implement AI Libraries for the UI

**Goal**: Implement AI Libraries for the UI

- **Why**:
- **Implementation**:
  - see if ai.dev components can be used to build the UI

## 8. Code Quality & Testing

**Goal**: Improve codebase reliability.

- **Why**: As the codebase grows, regression testing becomes critical.
- **Implementation**:
  - **Unit Tests**: Add `jest` or `vitest` for core logic (parsers, formatters).
  - **E2E Tests**: Use a library to test the full flow (spawning a mock CLI and checking UI updates).
  - **Strict Types**: Ensure `noImplicitAny` is true and improve type coverage for CLI events.
