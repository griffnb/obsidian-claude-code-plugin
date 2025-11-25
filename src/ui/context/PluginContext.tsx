import React, { createContext, useContext } from "react";
import { App } from "obsidian";
import ClaudeCodePlugin from "../../main";

interface PluginContextType {
  app: App;
  plugin: ClaudeCodePlugin;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const PluginProvider: React.FC<{
  app: App;
  plugin: ClaudeCodePlugin;
  children: React.ReactNode;
}> = ({ app, plugin, children }) => {
  return (
    <PluginContext.Provider value={{ app, plugin }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePlugin = () => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error("usePlugin must be used within a PluginProvider");
  }
  return context;
};
