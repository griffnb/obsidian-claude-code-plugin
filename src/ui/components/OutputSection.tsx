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
    <div
      className={`claude-code-output-section ${isCollapsed ? "collapsed" : ""}`}
    >
      <div
        className="claude-code-output-header collapsible-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="collapsible-title">
          <span className="collapse-indicator">
            {isCollapsed ? "▶ " : "▼ "}
          </span>
          Output
        </span>
      </div>

      {!isCollapsed && (
        <div className="claude-code-output-area collapsible-content">
          {outputLines.map((line, index) => (
            <div key={index} className="claude-code-output-line">
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
