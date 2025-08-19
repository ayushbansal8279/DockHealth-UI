import React from 'react';
import {
  WorkspaceWorkflowLibraryContainer,
  WorkspaceWorkflowLibraryContent,
} from './styled';
import TaskTemplateView from '../../task-template/TaskTemplateView';

const WorkspaceWorkflowLibrary = () => {
  return (
    <WorkspaceWorkflowLibraryContainer>
      <WorkspaceWorkflowLibraryContent>
        <TaskTemplateView />
      </WorkspaceWorkflowLibraryContent>
    </WorkspaceWorkflowLibraryContainer>
  );
};

export default WorkspaceWorkflowLibrary;
