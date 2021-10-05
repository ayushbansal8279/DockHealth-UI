/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import TaskTemplatePermissions from 'views/task-template/TaskTemplatePermissions/TaskTemplatePermissions';
import { HeaderContainer, StandardTaskItemCell, CreatedText } from './styled';

const TaskTemplateHeader = template => {
  const { createdBy, createdDate, taskTemplate } = template;
  return (
    <HeaderContainer>
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
