/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { HeaderContainer, StandardTaskItemCell, CreatedText } from './styled';

const TaskTemplateHeader = ({ createdBy, createdDate }) => {
  return (
    <HeaderContainer>
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdBy}</CreatedText>
      </StandardTaskItemCell>
      <StandardTaskItemCell width={150}>
        <CreatedText>{createdDate}</CreatedText>
      </StandardTaskItemCell>
    </HeaderContainer>
  );
};

export default TaskTemplateHeader;
