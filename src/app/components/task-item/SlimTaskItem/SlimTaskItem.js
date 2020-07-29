import React from 'react';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import ThreeDotsIcon from 'img/three-dots';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';

import { getCalendarIcon } from '../icons';
import {
  CircleIcon,
  SlimTaskItemContainer,
  SlimTaskItemDescription,
  SlimTaskItemParentTaskLabel,
  SlimTaskItemListLink,
  PrioritySwitch,
  ThreeDots,
  CompletedBy,
  DueDate,
  DueDateContainer,
  SlimTaskGridContainer,
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
  const {
    description,
    taskList,
    dueDate,
    priority,
    parentTask,
    completedDt,
    completedBy,
    status,
  } = task;
  const isOverdueTask =
    moment(dueDate).format('HH:mm') !== '00:00'
      ? moment(dueDate).isBefore(moment())
      : dueDate && moment(dueDate).isBefore(moment().startOf('day'));
  const taskListLength = isOverdueTask ? 20 : 24;
  const formattedTaskListName =
    taskList?.listName?.length > taskListLength
      ? taskList?.listName
          ?.substring(0, taskListLength)
          .trim()
          .concat('...')
      : taskList?.listName;

  const formattedTaskDescription =
    description?.length > 100
      ? description
          ?.substring(0, 100)
          .trim()
          .concat('...')
      : description;

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const isCompleted = status === 'COMPLETE';

  return (
    <SlimTaskItemContainer isDragging={isDragging} isSelected={isSelected}>
      {isDraggable && <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />}
      <PrioritySwitch left="42px" onClick={() => {}} isClickable={false}>
        {priority === 'HIGH' && (
          <img src={HighPriorityLabel} alt="Priority icon" />
        )}
      </PrioritySwitch>
      <Grid container justify="space-between" alignItems="center">
        <Grid item sm={6} md={7} lg={8}>
          <SlimTaskGridContainer>
            <CircleIcon
              src={isCompleted ? CircleCompleted : Circle}
              onClick={toggleTaskComplete}
              isClickable
            />
            <SlimTaskItemDescription>
              <div
                onClick={() => {
                  openDrawer();
                  storeAsCurrentTask(task, 'home');
                }}
              >
                {formattedTaskDescription}
              </div>
              <CompletedBy isCompleted={isCompleted}>
                <span>{`Completed by ${completedByName} ${completedDt &&
                  ` on ${
                    completedDt
                      ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                      : ''
                  }`}
                `}</span>
              </CompletedBy>
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
          </SlimTaskGridContainer>
        </Grid>
        <Grid item sm={2} md={2} lg={2}>
          <DueDateContainer>
            <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
            <img
              alt="due-date"
              src={getCalendarIcon(dueDate, true, isOverdueTask)}
            />
          </DueDateContainer>
        </Grid>
        <Grid item sm={4} md={3} lg={2}>
          {taskList && (
            <SlimTaskItemListLink
              to={`tasks/${taskList?.taskListIdentifier}`}
              withMargin={isOverdueTask}
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
        </Grid>
      </Grid>
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
