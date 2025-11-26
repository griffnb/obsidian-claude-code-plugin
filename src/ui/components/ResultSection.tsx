import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ResultSectionProps {
  statusMessage: string;
  isProcessing: boolean;
  result: string;
  error?: string;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  statusMessage,
  isProcessing,
  result,
  error,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!statusMessage && !result && !error) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div
        className="-m-2 flex cursor-pointer select-none items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="w-4 text-center text-xs text-gray-500 dark:text-gray-400">
            {isCollapsed ? "▶" : "▼"}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Result
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-4">
          {isProcessing && (
            <div className="flex flex-col gap-3 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 shadow-sm dark:border-purple-700 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <span>{statusMessage}</span>
              </div>
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="absolute h-full w-2/5 animate-[slide_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="prose prose-sm dark:prose-invert max-h-96 max-w-none overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
