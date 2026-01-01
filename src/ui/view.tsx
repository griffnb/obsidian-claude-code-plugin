import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import ClaudeCodePlugin from "../main";
import { ClaudeCodeApp } from "./components/ClaudeCodeApp";

export const VIEW_TYPE_CLAUDE_CODE = "claude-code-view";

export class ClaudeCodeView extends ItemView {
  plugin: ClaudeCodePlugin;
  root: Root | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: ClaudeCodePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_CLAUDE_CODE;
  }

  getDisplayText(): string {
    return "Claude Code";
  }

  getIcon(): string {
    return "bot";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();

    const rootEl = container.createEl("div", { cls: "claude-code-react-root" });

    this.root = createRoot(rootEl);
    this.root.render(<ClaudeCodeApp app={this.app} plugin={this.plugin} />);
  }

  async onClose(): Promise<void> {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  updateSettings(): void {
    if (this.root) {
      this.root.render(<ClaudeCodeApp app={this.app} plugin={this.plugin} />);
    }
  }
}
