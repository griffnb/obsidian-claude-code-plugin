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
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Your Instructions:
      </label>
      <textarea
        className="min-h-[100px] w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        rows={4}
        placeholder='e.g., "Add more examples to this section" or "Reorganize with better headers" (Enter to send, Ctrl+Enter for new line)'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isProcessing}
      />

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 transition-colors hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
          <input
            type="checkbox"
            checked={selectedTextOnly}
            onChange={(e) => setSelectedTextOnly(e.target.checked)}
            className="size-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="font-medium">Edit selected text only</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 transition-colors hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
          <input
            type="checkbox"
            checked={autoAccept}
            onChange={(e) => setAutoAccept(e.target.checked)}
            className="size-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="font-medium">Auto-accept changes</span>
        </label>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Model:
          </label>
          <select
            className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
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

      <div className="mt-2 flex gap-3">
        <button
          className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-md disabled:hover:translate-y-0"
          onClick={onRun}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="size-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Running...
            </span>
          ) : (
            "Run Claude Code"
          )}
        </button>
        {isProcessing && (
          <button
            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
