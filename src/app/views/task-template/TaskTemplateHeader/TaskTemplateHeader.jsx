/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import TaskItemPermissions from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemPermissions';
import { HeaderContainer, StandardTaskItemCell, CreatedText } from './styled';

const TaskTemplateHeader = template => {
  const { createdBy, createdDate } = template;
  return (
    <HeaderContainer>
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdBy}</CreatedText>
      </StandardTaskItemCell>
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdDate}</CreatedText>
      </StandardTaskItemCell>
      <TaskItemPermissions template={template} />
    </HeaderContainer>
  );
};

export default TaskTemplateHeader;
