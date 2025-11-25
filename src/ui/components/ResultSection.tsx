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
    <div
      className={`claude-code-result-section ${isCollapsed ? "collapsed" : ""}`}
    >
      <div
        className="claude-code-result-header collapsible-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="collapsible-title">
          <span className="collapse-indicator">
            {isCollapsed ? "▶ " : "▼ "}
          </span>
          Result
        </span>
      </div>

      {!isCollapsed && (
        <div className="collapsible-content">
          {isProcessing && (
            <div className="claude-code-status-area">
              <div className="claude-code-status-text">
                <span>{statusMessage}</span>
              </div>
              <div className="claude-code-progress-bar-container">
                <div className="claude-code-progress-bar"></div>
              </div>
            </div>
          )}

          {error && <div className="claude-code-error-message">❌ {error}</div>}

          {result && (
            <div className="claude-code-result-area markdown-rendered">
              {/* We'll use a simple div for now, but ideally ReactMarkdown */}
              <div dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
