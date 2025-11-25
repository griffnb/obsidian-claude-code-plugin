import React, { useEffect, useState } from "react";
import { usePlugin } from "../context/PluginContext";

export const Header: React.FC = () => {
  const { app } = usePlugin();
  const [currentNote, setCurrentNote] = useState<string>("No note selected");

  useEffect(() => {
    const updateNote = () => {
      const file = app.workspace.getActiveFile();
      setCurrentNote(file ? `📝 ${file.name}` : "📝 No note selected");
    };

    updateNote();

    const eventRef = app.workspace.on("active-leaf-change", updateNote);

    return () => {
      app.workspace.offref(eventRef);
    };
  }, [app]);

  return (
    <div className="claude-code-header">
      <div className="claude-code-header-title">
        <h4>Claude Code Assistant</h4>
      </div>
      <div className="claude-code-current-note">{currentNote}</div>
    </div>
  );
};
