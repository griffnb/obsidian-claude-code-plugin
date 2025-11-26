import React, { useState } from "react";
import { AgentStep } from "../../core/types";

interface AgentSectionProps {
  agentSteps: AgentStep[];
}

export const AgentSection: React.FC<AgentSectionProps> = ({ agentSteps }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (agentSteps.length === 0) {
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
            Activity
          </span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 flex max-h-40 flex-col gap-2 overflow-y-auto">
          {agentSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-2 text-xs dark:bg-gray-900"
            >
              <span className="shrink-0 text-base">{step.icon}</span>
              <span className="min-w-[70px] font-medium text-purple-600 dark:text-purple-400">
                {step.action}
              </span>
              <span className="flex-1 truncate font-mono text-[11px] text-gray-600 dark:text-gray-400">
                {step.target}
              </span>
              {step.duration && (
                <span className="min-w-[40px] shrink-0 rounded bg-gray-200 px-2 py-0.5 text-center text-[11px] font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {(step.duration / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
