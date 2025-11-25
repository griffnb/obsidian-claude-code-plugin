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
    "raw"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!modifiedContent) {
    return null;
  }

  return (
    <div
      className={`claude-code-preview-section ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div
        className="claude-code-preview-header collapsible-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="collapsible-title">
          <span className="collapse-indicator">
            {isCollapsed ? "▶ " : "▼ "}
          </span>
          Preview
        </span>
      </div>

      {!isCollapsed && (
        <div className="collapsible-content">
          <div className="claude-code-preview-tabs">
            <div
              className={`preview-tab ${activeTab === "raw" ? "active" : ""}`}
              onClick={() => setActiveTab("raw")}
            >
              Raw
            </div>
            <div
              className={`preview-tab ${activeTab === "diff" ? "active" : ""}`}
              onClick={() => setActiveTab("diff")}
            >
              Diff
            </div>
            <div
              className={`preview-tab ${
                activeTab === "rendered" ? "active" : ""
              }`}
              onClick={() => setActiveTab("rendered")}
            >
              Rendered
            </div>
          </div>

          <div className="claude-code-preview-content-container">
            {activeTab === "raw" && (
              <div className="claude-code-preview-area">
                <pre>{modifiedContent}</pre>
              </div>
            )}
            {activeTab === "diff" && (
              <div className="claude-code-preview-diff">
                <p>Diff view not implemented in React yet</p>
              </div>
            )}
            {activeTab === "rendered" && (
              <div className="claude-code-preview-rendered">
                <p>Rendered view not implemented in React yet</p>
              </div>
            )}
          </div>

          <div className="claude-code-preview-buttons">
            <button className="mod-cta" onClick={onApply}>
              ✓ Apply Changes
            </button>
            <button className="mod-warning" onClick={onReject}>
              ✗ Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
