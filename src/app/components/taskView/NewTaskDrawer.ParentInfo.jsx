import React from 'react';

import {
  AutoSaveContainer,
  AutoSaveLabel,
  ParentDescription,
  ParentInfoContainer,
  ParentRead,
  SubtaskCloseContainer,
  SubtaskInfoContainer,
  SubtaskLabel,
} from './NewTaskDrawer.styled';

export default ({
  addingTaskOrSubtask,
  autoSaveVisible,
  closeDrawer,
  parentTask,
  storeAsCurrentTask,
  subtaskOrder,
}) => (
  <>
    <ParentInfoContainer>
      {!parentTask.read && <ParentRead>NEW</ParentRead>}
      <ParentDescription>{parentTask.description}</ParentDescription>
    </ParentInfoContainer>
    <SubtaskInfoContainer topBorderActive={autoSaveVisible}>
      <SubtaskLabel>
        {addingTaskOrSubtask ? 'New subtask' : `Subtask #${subtaskOrder}`}
      </SubtaskLabel>
      <SubtaskCloseContainer
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          closeDrawer();
          storeAsCurrentTask(null);
        }}
      >
        &times;
      </SubtaskCloseContainer>
      <AutoSaveContainer visible={autoSaveVisible}>
        <AutoSaveLabel visible={autoSaveVisible}>Saved</AutoSaveLabel>
      </AutoSaveContainer>
    </SubtaskInfoContainer>
  </>
);
