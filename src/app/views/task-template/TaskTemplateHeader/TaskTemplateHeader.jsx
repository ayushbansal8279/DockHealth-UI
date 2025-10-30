/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import TaskTemplatePermissions from 'views/task-template/TaskTemplatePermissions/TaskTemplatePermissions';
import { HeaderContainer, StandardTaskItemCell, CreatedText } from './styled';

const TaskTemplateHeader = ({
  createdBy,
  createdDate,
  taskTemplate,
  shareTaskWorkflowAvailable,
}) => {
  return (
    <HeaderContainer>
      {shareTaskWorkflowAvailable && (
        <>
          <StandardTaskItemCell width={150}>
            <CreatedText>
              {taskTemplate?.sharedByOrganization?.organizationName}
            </CreatedText>
          </StandardTaskItemCell> 
          <StandardTaskItemCell width={150}>
            <CreatedText>
              {taskTemplate?.sharedWithOrganizations
                ?.map((org) => org.organizationName)
                .join(', ')}
            </CreatedText>
          </StandardTaskItemCell>
        </>
      )}
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdBy}</CreatedText>
      </StandardTaskItemCell>
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdDate}</CreatedText>
      </StandardTaskItemCell>
      <TaskTemplatePermissions template={taskTemplate} />
    </HeaderContainer>
  );
};

export default TaskTemplateHeader;
