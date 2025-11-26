import { execSync } from "child_process";
import { App, PluginSettingTab, Setting } from "obsidian";
import ClaudeCodePlugin from "../main";

export interface ClaudeCodeSettings {
  claudeCodePath: string;
  autoDetectPath: boolean;
  modelAlias: "sonnet" | "opus" | "haiku" | "";
  customSystemPrompt: string;
  preserveCursorPosition: boolean;
  confirmBeforeApplying: boolean;
  timeoutSeconds: number;
  autoAcceptChanges: boolean;
  allowVaultAccess: boolean;
  enablePermissionlessMode: boolean;
}

export const DEFAULT_SETTINGS: ClaudeCodeSettings = {
  claudeCodePath: "",
  autoDetectPath: true,
  modelAlias: "",
  customSystemPrompt: "",
  preserveCursorPosition: true,
  confirmBeforeApplying: true,
  timeoutSeconds: 300,
  autoAcceptChanges: false,
  allowVaultAccess: true,
  enablePermissionlessMode: false,
};

export class ClaudeCodeSettingTab extends PluginSettingTab {
  plugin: ClaudeCodePlugin;

  constructor(app: App, plugin: ClaudeCodePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Claude Code Integration Settings" });

    // Auto-detect Claude Code path
    new Setting(containerEl)
      .setName("Auto-detect Claude Code path")
      .setDesc("Automatically detect the Claude Code executable location")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoDetectPath)
          .onChange(async (value) => {
            this.plugin.settings.autoDetectPath = value;
            if (value) {
              const detectedPath = this.detectClaudeCodePath();
              if (detectedPath) {
                this.plugin.settings.claudeCodePath = detectedPath;
              }
            }
            await this.plugin.saveSettings();
            this.display(); // Refresh to show detected path
          }),
      );

    // Claude Code executable path
    new Setting(containerEl)
      .setName("Claude Code executable path")
      .setDesc(
        "Full path to the Claude Code executable (e.g., /usr/local/bin/claude)",
      )
      .addText((text) =>
        text
          .setPlaceholder("/usr/local/bin/claude")
          .setValue(this.plugin.settings.claudeCodePath)
          .setDisabled(this.plugin.settings.autoDetectPath)
          .onChange(async (value) => {
            this.plugin.settings.claudeCodePath = value;
            await this.plugin.saveSettings();
          }),
      );

    // Test Claude Code button
    new Setting(containerEl)
      .setName("Test Claude Code installation")
      .setDesc("Verify that Claude Code is accessible and working")
      .addButton((button) =>
        button.setButtonText("Test").onClick(async () => {
          const result = await this.testClaudeCode();
          if (result.success) {
            button.setButtonText("✓ Working!");
            setTimeout(() => button.setButtonText("Test"), 2000);
          } else {
            button.setButtonText("✗ Failed");
            setTimeout(() => button.setButtonText("Test"), 2000);
            alert(`Claude Code test failed: ${result.error}`);
          }
        }),
      );

    // Custom system prompt
    new Setting(containerEl)
      .setName("Custom system prompt")
      .setDesc("Optional custom system prompt to prepend to all requests")
      .addTextArea((text) => {
        text
          .setPlaceholder("You are helping edit markdown notes...")
          .setValue(this.plugin.settings.customSystemPrompt)
          .onChange(async (value) => {
            this.plugin.settings.customSystemPrompt = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 4;
        text.inputEl.cols = 50;
      });

    // Preserve cursor position
    new Setting(containerEl)
      .setName("Preserve cursor position")
      .setDesc("Try to maintain cursor position after applying changes")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.preserveCursorPosition)
          .onChange(async (value) => {
            this.plugin.settings.preserveCursorPosition = value;
            await this.plugin.saveSettings();
          }),
      );

    // Confirm before applying
    new Setting(containerEl)
      .setName("Confirm before applying changes")
      .setDesc(
        "Always show confirmation dialog before applying Claude Code changes",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.confirmBeforeApplying)
          .onChange(async (value) => {
            this.plugin.settings.confirmBeforeApplying = value;
            await this.plugin.saveSettings();
          }),
      );

    // Auto-accept changes
    new Setting(containerEl)
      .setName("Auto-accept changes")
      .setDesc(
        "Automatically apply changes without showing preview (⚠️ Use with caution!)",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoAcceptChanges)
          .onChange(async (value) => {
            this.plugin.settings.autoAcceptChanges = value;
            await this.plugin.saveSettings();
          }),
      );

    // Model Alias
    new Setting(containerEl)
      .setName("Model")
      .setDesc(
        "Select the Claude model to use: Sonnet (balanced), Opus (most capable), or Haiku (fastest). Leave empty to use the default subagent model.",
      )
      .addDropdown((dropdown) =>
        dropdown
          .addOption("", "Default (subagent model)")
          .addOption("sonnet", "Sonnet (balanced)")
          .addOption("opus", "Opus (most capable)")
          .addOption("haiku", "Haiku (fastest)")
          .setValue(this.plugin.settings.modelAlias)
          .onChange(async (value) => {
            this.plugin.settings.modelAlias = value as
              | "sonnet"
              | "opus"
              | "haiku"
              | "";
            await this.plugin.saveSettings();
          }),
      );

    // Allow Vault Access
    new Setting(containerEl)
      .setName("Allow vault-wide access")
      .setDesc(
        "Allow Claude to read/search other files in your vault (not just the current note)",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.allowVaultAccess)
          .onChange(async (value) => {
            this.plugin.settings.allowVaultAccess = value;
            await this.plugin.saveSettings();
          }),
      );

    // Enable Permissionless Mode
    new Setting(containerEl)
      .setName("Enable permissionless mode")
      .setDesc(
        "Allow Claude to execute actions without asking for permission each time (⚠️ Use with caution! Claude will have full control)",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enablePermissionlessMode)
          .onChange(async (value) => {
            this.plugin.settings.enablePermissionlessMode = value;
            await this.plugin.saveSettings();
          }),
      );

    // Timeout
    new Setting(containerEl)
      .setName("Timeout (seconds)")
      .setDesc("Maximum time to wait for Claude Code response (0 = no timeout)")
      .addText((text) =>
        text
          .setPlaceholder("300")
          .setValue(String(this.plugin.settings.timeoutSeconds))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num >= 0) {
              this.plugin.settings.timeoutSeconds = num;
              await this.plugin.saveSettings();
            }
          }),
      );
  }

  /**
   * Attempt to detect Claude Code installation path
   */
  private detectClaudeCodePath(): string | null {
    const possiblePaths = [
      "claude", // If in PATH
      "/usr/local/bin/claude",
      "/usr/bin/claude",
      `${process.env.HOME}/.local/bin/claude`,
      `${process.env.HOME}/bin/claude`,
      `${process.env.HOME}/.bun/bin/claude`,
    ];

    for (const path of possiblePaths) {
      try {
        // Try to execute 'which' command for simple path names
        if (!path.includes("/")) {
          const result = execSync(`which ${path}`, { encoding: "utf8" }).trim();
          if (result) {
            return result;
          }
        } else {
          // Check if file exists for absolute paths
          const fs = require("fs");
          if (fs.existsSync(path)) {
            return path;
          }
        }
      } catch (e) {
        // Continue to next path
      }
    }

    return null;
  }

  /**
   * Test if Claude Code is accessible and working
   */
  private async testClaudeCode(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const path = this.plugin.settings.claudeCodePath || "claude";
      const { exec } = require("child_process");
      const fs = require("fs");

      // Build enhanced PATH
      const envPath = process.env.PATH || "";
      const pathsToAdd = [
        `${process.env.HOME}/.nvm/versions/node/v20.18.2/bin`,
        `${process.env.HOME}/.bun/bin`,
        "/usr/local/bin",
        "/usr/bin",
        "/bin",
      ].filter((p) => fs.existsSync(p));

      const enhancedPath = [
        ...new Set([...pathsToAdd, ...envPath.split(":")]),
      ].join(":");

      return new Promise((resolve) => {
        exec(
          `${path} --version`,
          {
            timeout: 5000,
            env: {
              ...process.env,
              PATH: enhancedPath,
            },
          },
          (error: any, stdout: string, stderr: string) => {
            if (error) {
              resolve({ success: false, error: error.message });
            } else {
              resolve({ success: true });
            }
          },
        );
      });
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }
}
