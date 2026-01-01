/**
 * Note Context Manager - Manages per-note conversation contexts
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

import { ClaudeCodeRunner } from "../core/claude-code-runner";
import { ClaudeCodeSettings } from "../core/settings";
import { AgentStep, NoteContext, SessionHistoryItem } from "../core/types";

interface NoteFile {
  notePath: string;
  sessionId: string | null;
  history: SessionHistoryItem[];
  outputLines: string[];
  agentSteps: AgentStep[];
  savedAt: string;
}

export class NoteContextManager {
  private contexts: Map<string, NoteContext> = new Map();
  private settings: ClaudeCodeSettings;
  private dataDir: string;

  constructor(settings: ClaudeCodeSettings, dataDir: string) {
    this.settings = settings;
    this.dataDir = dataDir;
  }

  /**
   * Get or create context for a note
   */
  getContext(notePath: string): NoteContext {
    if (!this.contexts.has(notePath)) {
      this.contexts.set(notePath, this.createNewContext());
    }
    return this.contexts.get(notePath)!;
  }

  /**
   * Create a new empty context
   */
  private createNewContext(): NoteContext {
    return {
      history: [],
      sessionId: null,
      currentResponse: null,
      currentRequest: null,
      outputLines: [],
      agentSteps: [],
      runner: new ClaudeCodeRunner(this.settings),
      isRunning: false,
    };
  }

  /**
   * Load all note contexts from disk
   */
  async loadContexts(vaultPath: string): Promise<void> {
    const contextsDir = path.join(vaultPath, this.dataDir);

    if (!fs.existsSync(contextsDir)) {
      return;
    }

    // Read all note context directories
    const noteDirs = fs.readdirSync(contextsDir);

    for (const noteHash of noteDirs) {
      const contextFile = path.join(contextsDir, noteHash, "context.json");

      if (fs.existsSync(contextFile)) {
        try {
          const data = JSON.parse(
            fs.readFileSync(contextFile, "utf8"),
          ) as NoteFile;

          // Reconstruct the context
          const context: NoteContext = {
            history: data.history || [],
            sessionId: data.sessionId || null,
            currentResponse: null,
            currentRequest: null,
            outputLines: data.outputLines || [],
            agentSteps: data.agentSteps || [],
            runner: new ClaudeCodeRunner(this.settings),
            isRunning: false,
          };

          // Store using the note path from the data
          if (data.notePath) {
            this.contexts.set(data.notePath, context);
          }
        } catch (e) {
          // Skip contexts that fail to load
        }
      }
    }
  }

  /**
   * Save a note's context to disk
   */
  async saveContext(notePath: string, vaultPath: string): Promise<void> {
    const context = this.contexts.get(notePath);
    if (!context) return;

    const noteHash = crypto.createHash("md5").update(notePath).digest("hex");
    const contextDir = path.join(vaultPath, this.dataDir, noteHash);

    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
    }

    const contextFile = path.join(contextDir, "context.json");

    const dataToSave: NoteFile = {
      notePath: notePath,
      sessionId: context.sessionId,
      history: context.history,
      outputLines: context.outputLines,
      agentSteps: context.agentSteps,
      savedAt: new Date().toISOString(),
    };

    fs.writeFileSync(contextFile, JSON.stringify(dataToSave, null, 2));
  }

  /**
   * Save all contexts
   */
  async saveAllContexts(vaultPath: string): Promise<void> {
    for (const [notePath, _] of this.contexts) {
      await this.saveContext(notePath, vaultPath);
    }
  }

  /**
   * Clear history for a note
   */
  clearHistory(notePath: string): void {
    const context = this.contexts.get(notePath);
    if (context) {
      context.history = [];
      context.outputLines = [];
      context.agentSteps = [];
    }
  }

  /**
   * Get all contexts
   */
  getAllContexts(): Map<string, NoteContext> {
    return this.contexts;
  }

  /**
   * Check if a note has a context
   */
  hasContext(notePath: string): boolean {
    return this.contexts.has(notePath);
  }
}
