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
    <div
      className={`claude-code-agent-container ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="claude-code-agent-column claude-code-activity-column">
        <div
          className="claude-code-agent-column-header collapsible-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="collapsible-title">
            <span className="collapse-indicator">
              {isCollapsed ? "▶ " : "▼ "}
            </span>
            Activity
          </span>
        </div>

        {!isCollapsed && (
          <div className="claude-code-agent-steps collapsible-content">
            {agentSteps.map((step, index) => (
              <div key={index} className="claude-code-agent-step">
                <span className="agent-step-icon">{step.icon}</span>
                <span className="agent-step-action">{step.action}</span>
                <span className="agent-step-target">{step.target}</span>
                {step.duration && (
                  <span className="agent-step-duration">
                    {(step.duration / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
