import React, { useState } from "react";

interface PreviewSectionProps {
  modifiedContent: string;
  onApply: () => void;
  onReject: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  modifiedContent,
  onApply,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<"raw" | "diff" | "rendered">(
    "raw",
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!modifiedContent) {
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
            Preview
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-4">
          <div className="flex gap-1 border-b-2 border-gray-200 dark:border-gray-700">
            <div
              className={`-mb-0.5 cursor-pointer border-b-2 px-5 py-2 text-sm font-medium transition-all ${
                activeTab === "raw"
                  ? "border-purple-600 font-semibold text-purple-600 dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("raw")}
            >
              Raw
            </div>
            <div
              className={`-mb-0.5 cursor-pointer border-b-2 px-5 py-2 text-sm font-medium transition-all ${
                activeTab === "diff"
                  ? "border-purple-600 font-semibold text-purple-600 dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("diff")}
            >
              Diff
            </div>
            <div
              className={`-mb-0.5 cursor-pointer border-b-2 px-5 py-2 text-sm font-medium transition-all ${
                activeTab === "rendered"
                  ? "border-purple-600 font-semibold text-purple-600 dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("rendered")}
            >
              Rendered
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            {activeTab === "raw" && (
              <div className="p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                  {modifiedContent}
                </pre>
              </div>
            )}
            {activeTab === "diff" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Diff view not implemented in React yet
                </p>
              </div>
            )}
            {activeTab === "rendered" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rendered view not implemented in React yet
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
              onClick={onApply}
            >
              ✓ Apply Changes
            </button>
            <button
              className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
              onClick={onReject}
            >
              ✗ Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
