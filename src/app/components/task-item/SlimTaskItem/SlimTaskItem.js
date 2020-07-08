import React from 'react';
import moment from 'moment';
import Circle from 'img/circle';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import ThreeDotsIcon from 'img/three-dots';

import {
  CircleIcon,
  OverdueBar,
  SlimTaskItemContainer,
  SlimTaskItemRow,
  SlimTaskItemDescription,
  SlimTaskItemDescriptionDetails,
  SlimTaskItemParentTaskLabel,
  SlimTaskItemRightSide,
  SlimTaskItemListLink,
  PrioritySwitch,
  ThreeDots,
} from '../styled';

const SlimTaskItem = ({
  task,
  toggleTaskComplete,
  storeAsCurrentTask,
  redirectToParentTask,
  isDragging,
  isDraggable,
  dragHandleProps,
  openDrawer,
  isSelected,
}) => {
  const { description, taskList, dueDate, priority, parentTask } = task;
  return (
    <SlimTaskItemContainer isDragging={isDragging} isSelected={isSelected}>
      {isDraggable && <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />}
      <PrioritySwitch left="34px" onClick={() => {}} isClickable={false}>
        {priority === 'HIGH' && (
          <img src={HighPriorityLabel} alt="Priority icon" />
        )}
      </PrioritySwitch>
      <CircleIcon src={Circle} onClick={toggleTaskComplete} isClickable />
      <SlimTaskItemRow>
        <SlimTaskItemDescription>
          <SlimTaskItemDescriptionDetails
            onClick={() => {
              openDrawer();
              storeAsCurrentTask(task, 'home');
            }}
          >
            {description}
          </SlimTaskItemDescriptionDetails>
          {parentTask && (
            <SlimTaskItemParentTaskLabel>
              Subtask of{' '}
              <span
                onClick={() => {
                  storeAsCurrentTask(parentTask);
                  redirectToParentTask(
                    parentTask?.taskList?.taskListIdentifier,
                    parentTask?.taskIdentifier,
                    parentTask?.status,
                  );
                }}
              >
                {parentTask.description}
              </span>
            </SlimTaskItemParentTaskLabel>
          )}
        </SlimTaskItemDescription>
        <SlimTaskItemRightSide>
          {taskList && (
            <SlimTaskItemListLink to={`tasks/${taskList?.taskListIdentifier}`}>
              {taskList?.listName}
            </SlimTaskItemListLink>
          )}
          {dueDate && moment().isAfter(moment(dueDate), 'days') && (
            <OverdueBar>Overdue</OverdueBar>
          )}
        </SlimTaskItemRightSide>
      </SlimTaskItemRow>
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
