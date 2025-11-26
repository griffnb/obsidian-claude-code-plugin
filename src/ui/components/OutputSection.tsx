import React, { useState } from "react";

interface OutputSectionProps {
  outputLines: string[];
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  outputLines,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (outputLines.length === 0) {
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
            Output
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 max-h-64 min-h-24 flex-1 select-text overflow-y-auto font-mono text-xs leading-relaxed">
          {outputLines.map((line, index) => (
            <div
              key={index}
              className="whitespace-pre-wrap break-words py-1 text-gray-900 dark:text-gray-100"
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
