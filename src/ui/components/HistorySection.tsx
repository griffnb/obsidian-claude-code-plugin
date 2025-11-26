import React, { useState } from "react";
import { SessionHistoryItem } from "../../core/types";

interface HistorySectionProps {
  history: SessionHistoryItem[];
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (history.length === 0) {
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
            History
          </span>
        </div>
        <button
          className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onClearHistory();
          }}
        >
          Clear
        </button>
      </div>

      {!isCollapsed && (
        <ul className="m-0 mt-2 max-h-52 list-none space-y-2 overflow-y-auto p-0">
          {history.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer rounded border-b border-gray-200 p-3 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
            >
              <div className="mb-1 truncate text-sm text-gray-900 dark:text-gray-100">
                {item.prompt}
              </div>
              <div className="truncate text-xs text-gray-600 dark:text-gray-400">
                {new Date(item.timestamp).toLocaleString()}
                {item.success ? " ✓" : " ✗"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
