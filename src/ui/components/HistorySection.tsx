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
    <div
      className={`claude-code-history-section ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div
        className="claude-code-history-header collapsible-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="collapsible-title">
          <span className="collapse-indicator">
            {isCollapsed ? "▶ " : "▼ "}
          </span>
          History
        </span>
        <button
          className="claude-code-clear-history"
          onClick={(e) => {
            e.stopPropagation();
            onClearHistory();
          }}
        >
          Clear
        </button>
      </div>

      {!isCollapsed && (
        <ul className="claude-code-history-list collapsible-content">
          {history.map((item, index) => (
            <li key={index} className="claude-code-history-item">
              <div className="history-prompt">{item.prompt}</div>
              <div className="history-meta">
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
