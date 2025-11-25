import React from "react";

interface InputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  isProcessing: boolean;
  onRun: () => void;
  onCancel: () => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  autoAccept: boolean;
  setAutoAccept: (value: boolean) => void;
  selectedTextOnly: boolean;
  setSelectedTextOnly: (value: boolean) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  prompt,
  setPrompt,
  isProcessing,
  onRun,
  onCancel,
  selectedModel,
  setSelectedModel,
  autoAccept,
  setAutoAccept,
  selectedTextOnly,
  setSelectedTextOnly,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onRun();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      setPrompt(value.substring(0, start) + "\n" + value.substring(end));
      // Need to set cursor position in next tick or use ref
    }
  };

  return (
    <div className="claude-code-input-section">
      <label>Your Instructions:</label>
      <textarea
        className="claude-code-prompt-input"
        rows={4}
        placeholder='e.g., "Add more examples to this section" or "Reorganize with better headers" (Enter to send, Ctrl+Enter for new line)'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isProcessing}
      />

      <div className="claude-code-options">
        <label className="claude-code-checkbox-label">
          <input
            type="checkbox"
            checked={selectedTextOnly}
            onChange={(e) => setSelectedTextOnly(e.target.checked)}
          />{" "}
          Edit selected text only
        </label>

        <label className="claude-code-checkbox-label">
          <input
            type="checkbox"
            checked={autoAccept}
            onChange={(e) => setAutoAccept(e.target.checked)}
          />{" "}
          Auto-accept changes
        </label>

        <div className="claude-code-model-select">
          <label className="claude-code-model-label">Model: </label>
          <select
            className="claude-code-model-dropdown"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Default</option>
            <option value="sonnet">Sonnet</option>
            <option value="opus">Opus</option>
            <option value="haiku">Haiku</option>
          </select>
        </div>
      </div>

      <div className="claude-code-button-container">
        <button className="mod-cta" onClick={onRun} disabled={isProcessing}>
          {isProcessing ? "Running..." : "Run Claude Code"}
        </button>
        {isProcessing && (
          <button className="claude-code-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
