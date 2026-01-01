import { useEffect, useState } from "react";
import { usePlugin } from "../context/PluginContext";

export const Header = () => {
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
    <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-4 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
          <span className="text-lg text-white">🤖</span>
        </div>
        <h4 className="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          Claude Code Assistant
        </h4>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1.5 shadow-sm dark:border-purple-700 dark:from-purple-900/20 dark:to-indigo-900/20">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentNote}
        </span>
      </div>
    </div>
  );
};
