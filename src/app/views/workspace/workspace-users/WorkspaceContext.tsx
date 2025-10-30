import React, { createContext, ReactNode, useContext } from "react";

const WorkspaceContext = createContext({ workspaceIdentifier: '' });

interface WorkspaceContextProviderProps {
  workspaceIdentifier: string,
  children: ReactNode;
}

export const WorkspaceContextProvider = ({ workspaceIdentifier, children }: WorkspaceContextProviderProps) => (
  <WorkspaceContext.Provider value={{ workspaceIdentifier }}>
    {children}
  </WorkspaceContext.Provider>
);

export const useWorkspace = () => useContext(WorkspaceContext);