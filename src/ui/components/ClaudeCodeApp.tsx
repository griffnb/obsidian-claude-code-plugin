import { App, MarkdownView, Notice, TFile } from "obsidian";
import React, { useEffect, useState } from "react";
import { AgentStep, SessionHistoryItem } from "../../core/types";
import ClaudeCodePlugin from "../../main";
import { NoteContextManager } from "../../managers/note-context-manager";
import { AgentActivityTracker } from "../agent-activity-tracker";
import { PluginProvider } from "../context/PluginContext";
import { OutputRenderer } from "../output-renderer";
import { OutputStatusManager } from "../parsers/output-status-manager";
import { AgentSection } from "./AgentSection";
import { Header } from "./Header";
import { HistorySection } from "./HistorySection";
import { InputSection } from "./InputSection";
import { OutputSection } from "./OutputSection";
import { PreviewSection } from "./PreviewSection";
import { ResultSection } from "./ResultSection";

interface ClaudeCodeAppProps {
  app: App;
  plugin: ClaudeCodePlugin;
}

export const ClaudeCodeApp: React.FC<ClaudeCodeAppProps> = ({
  app,
  plugin,
}) => {
  // State
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");

  // Settings State
  const [selectedModel, setSelectedModel] = useState(
    plugin.settings.modelAlias || "",
  );
  const [autoAccept, setAutoAccept] = useState(
    plugin.settings.autoAcceptChanges,
  );
  const [selectedTextOnly, setSelectedTextOnly] = useState(false);

  // Managers (refs to keep them across renders)
  const contextManager = React.useRef(
    new NoteContextManager(
      plugin.settings,
      app.vault.configDir + "/claude-code-sessions",
    ),
  );
  const agentTracker = React.useRef(new AgentActivityTracker());

  // Load context when active file changes
  useEffect(() => {
    const loadContext = async () => {
      const file = app.workspace.getActiveFile();
      if (file) {
        const context = contextManager.current.getContext(file.path);
        setOutputLines([...context.outputLines]);
        setAgentSteps([...context.agentSteps]);
        setHistory([...context.history]);
        if (context.currentResponse?.assistantMessage) {
          setResult(context.currentResponse.assistantMessage);
        }
      }
    };

    loadContext();
    const eventRef = app.workspace.on("active-leaf-change", loadContext);
    return () => app.workspace.offref(eventRef);
  }, [app]);

  const findMarkdownView = (file: TFile): MarkdownView | null => {
    // 1. Try to get the active view if it's a markdown view and matches the file
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView && activeView.file && activeView.file.path === file.path) {
      return activeView;
    }

    // 2. Search all markdown leaves for the one matching the file
    const leaves = app.workspace.getLeavesOfType("markdown");
    for (const leaf of leaves) {
      const view = leaf.view as MarkdownView;
      if (view.file && view.file.path === file.path) {
        return view;
      }
    }

    // 3. Fallback: use the first markdown view if available
    if (leaves.length > 0) {
      return leaves[0].view as MarkdownView;
    }

    return null;
  };

  const handleRun = async () => {
    if (!prompt.trim()) {
      new Notice("Please enter a prompt");
      return;
    }

    const file = app.workspace.getActiveFile();
    if (!file) {
      new Notice("No active note found");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("🤔 Claude is processing...");
    setOutputLines([]);
    setAgentSteps([]);
    setResult("");
    setError("");
    setModifiedContent("");

    try {
      // Get editor content
      const view = findMarkdownView(file);
      if (!view) {
        throw new Error("No markdown view found. Please open a note.");
      }

      const editor = view.editor;
      const selection = editor.getSelection();
      const content = editor.getValue();
      const vaultPath = (app.vault.adapter as any).basePath;

      const context = contextManager.current.getContext(file.path);

      // Prepare request
      context.currentRequest = {
        noteContent: content,
        userPrompt: prompt,
        notePath: file.path,
        selectedText: selectedTextOnly ? selection : undefined,
        vaultPath: vaultPath,
        runtimeModelOverride: selectedModel || undefined,
      };

      context.isRunning = true;

      const response = await context.runner.run(
        context.currentRequest,
        (line, isMarkdown, isStreaming, isAssistantMessage) => {
          // Update output lines
          setOutputLines((prev) => [...prev, line]);

          // Update status
          const status = OutputStatusManager.extractStatus(line);
          if (status) setStatusMessage(status);

          // Track agent activity
          const step = OutputRenderer.parseAgentActivity(line);
          if (step) {
            setAgentSteps((prev) => [...prev, step]);
          }

          // Handle streaming result
          if (isAssistantMessage) {
            setResult((prev) => prev + line);
          }
        },
      );

      context.isRunning = false;
      setIsProcessing(false);
      setStatusMessage("");

      if (response.success) {
        setHistory((prev) => [
          ...prev,
          {
            prompt,
            timestamp: new Date(),
            success: true,
            notePath: file.path,
            response,
            request: context.currentRequest || undefined,
          },
        ]);

        if (response.modifiedContent) {
          setModifiedContent(response.modifiedContent);
          if (autoAccept) {
            handleApply(response.modifiedContent);
          }
        } else if (response.assistantMessage) {
          setResult(response.assistantMessage);
        }
      } else {
        setError(response.error || "Unknown error");
      }
    } catch (e) {
      setIsProcessing(false);
      setError(String(e));
    }
  };

  const handleApply = (content: string) => {
    const file = app.workspace.getActiveFile();
    if (!file) {
      new Notice("No active file to apply changes to");
      return;
    }

    const view = findMarkdownView(file);
    if (view) {
      view.editor.setValue(content);
      new Notice("Changes applied!");
      setModifiedContent("");
    } else {
      new Notice("Could not find editor to apply changes");
    }
  };

  const handleReject = () => {
    setModifiedContent("");
    new Notice("Changes rejected");
  };

  const handleClearHistory = () => {
    setHistory([]);
    // TODO: Clear from context manager too
  };

  return (
    <PluginProvider app={app} plugin={plugin}>
      <div className="flex h-full flex-col gap-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
        <Header />

        <InputSection
          prompt={prompt}
          setPrompt={setPrompt}
          isProcessing={isProcessing}
          onRun={handleRun}
          onCancel={() => {
            /* Implement cancel */
          }}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          autoAccept={autoAccept}
          setAutoAccept={setAutoAccept}
          selectedTextOnly={selectedTextOnly}
          setSelectedTextOnly={setSelectedTextOnly}
        />

        <ResultSection
          statusMessage={statusMessage}
          isProcessing={isProcessing}
          result={result}
          error={error}
        />

        <PreviewSection
          modifiedContent={modifiedContent}
          onApply={() => handleApply(modifiedContent)}
          onReject={handleReject}
        />

        <AgentSection agentSteps={agentSteps} />

        <OutputSection outputLines={outputLines} />

        <HistorySection history={history} onClearHistory={handleClearHistory} />
      </div>
    </PluginProvider>
  );
};
