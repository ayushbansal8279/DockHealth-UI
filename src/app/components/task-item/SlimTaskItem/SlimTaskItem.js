import React from 'react';
import moment from 'moment';
import Circle from 'img/circle';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import {
  CircleIcon,
  OverdueBar,
  SlimTaskItemContainer,
  SlimTaskItemRow,
  SlimTaskItemDescription,
  SlimTaskItemParentTaskLabel,
  SlimTaskItemRightSide,
  SlimTaskItemListLink,
  PrioritySwitch,
} from '../styled';

const SlimTaskItem = ({
  description,
  taskList,
  dueDate,
  priority,
  parentTask,
  toggleTaskComplete,
}) => {
  return (
    <SlimTaskItemContainer>
      <PrioritySwitch left="-24px" onClick={() => {}} isClickable={false}>
        {priority === 'HIGH' && (
          <img src={HighPriorityLabel} alt="Priority icon" />
        )}
      </PrioritySwitch>
      <CircleIcon src={Circle} onClick={toggleTaskComplete} />
      <SlimTaskItemRow>
        <SlimTaskItemDescription>
          <span>{description}</span>
          {parentTask && (
            <SlimTaskItemParentTaskLabel>
              Subtask of <span>{parentTask.description}</span>
            </SlimTaskItemParentTaskLabel>
          )}
        </SlimTaskItemDescription>
        <SlimTaskItemRightSide>
          {taskList && (
            <SlimTaskItemListLink to={`tasks/${taskList?.taskListIdentifier}`}>
              {taskList?.listName}
            </SlimTaskItemListLink>
          )}
          {dueDate && moment(new Date()).isAfter(dueDate) && (
            <OverdueBar>Overdue</OverdueBar>
          )}
        </SlimTaskItemRightSide>
      </SlimTaskItemRow>
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
