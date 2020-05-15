import React from 'react';
import XInCircle from 'img/x-in-circle';
import MoveDownIcon from 'img/move-down-icon';

import {
  MoveUpIcon,
  TasksGroupActionButton,
  TasksGroupActionButtonsContainer,
} from './styled';

const TasksGroupActionButtons = ({
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
}) => {
  return (
    <TasksGroupActionButtonsContainer className="action-buttons">
      <TasksGroupActionButton
        isDisplayed={!isDefaultGroup}
        onClick={deleteGroup}
      >
        <img src={XInCircle} alt="Delete" />
        <p>Delete</p>
      </TasksGroupActionButton>
      <TasksGroupActionButton isDisplayed={!isFirstGroup} onClick={moveGroupUp}>
        <MoveUpIcon src={MoveDownIcon} alt="Move up" />
        <p>Move up</p>
      </TasksGroupActionButton>
      <TasksGroupActionButton
        isDisplayed={!isLastGroup}
        onClick={moveGroupDown}
      >
        <img src={MoveDownIcon} alt="Move down" />
        <p>Move down</p>
      </TasksGroupActionButton>
    </TasksGroupActionButtonsContainer>
  );
};

export default TasksGroupActionButtons;
