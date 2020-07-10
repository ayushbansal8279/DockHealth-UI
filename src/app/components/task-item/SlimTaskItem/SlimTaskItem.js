import React from 'react';
import moment from 'moment';
import Circle from 'img/circle';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import ThreeDotsIcon from 'img/three-dots';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';

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
  const hasOverdue = dueDate && moment().isAfter(moment(dueDate), 'days');
  const taskListLength = hasOverdue ? 20 : 24;
  const formattedTaskListName =
    taskList?.listName?.length > taskListLength
      ? taskList?.listName
          ?.substring(0, taskListLength)
          .trim()
          .concat('...')
      : taskList?.listName;

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
          <div
            onClick={() => {
              openDrawer();
              storeAsCurrentTask(task, 'home');
            }}
          >
            {description}
          </div>
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
            <SlimTaskItemListLink
              to={`tasks/${taskList?.taskListIdentifier}`}
              withMargin={hasOverdue}
            >
              <UniversalTooltipContainer
                placement="top"
                label={taskList?.listName}
                maxWidth="240px"
              >
                {formattedTaskListName}
              </UniversalTooltipContainer>
            </SlimTaskItemListLink>
          )}
          {hasOverdue && <OverdueBar>Overdue</OverdueBar>}
        </SlimTaskItemRightSide>
      </SlimTaskItemRow>
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
