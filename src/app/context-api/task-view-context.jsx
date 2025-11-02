import React, { createContext, useContext } from 'react';

export const TaskViewContext = createContext({
  addNewGroup: false,
  handleAddNewGroup: (value) => {},
  changeViewType: '',
  handleSetChangeViewType: (value) => {},
  showShadow: false,
  handleScroll: (event) => {},
  tasks: [],
  handleAddTask: (newTask) => {},
  handleRemoveAllTasks: () => {},
  workflowPopoverOpen: false,
  handleWorkflowPopoverOpen: (isPopoveOpen) => {},
  patientPopoverOpen: false,
  handlePatientPopoverOpen: (isPopoveOpen) => {},
  handleScrollToAddGroupName: () => {},
});

export const useTaskViewContext = () => {
  const context = useContext(TaskViewContext);
  if (!context) {
    throw new Error(
      'useTaskViewContext must be used within a TaskViewContext.Provider',
    );
  }
  return context;
};

export default TaskViewContext;
