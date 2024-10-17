import React, { useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import moment from 'moment';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import CircleCompletedHover from 'img/circle-completed-hover.svg';
import TaskAutomationPending from 'img/task-automation-pending.svg';
import TaskAutomationComplete from 'img/task-automation-complete.svg';
import {
  CircleIcon,
  TootipCompletedBy,
  TootipCompletedByDate,
  TootipCompletedByName,
} from '../../styled';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskItemCompleteIcon = ({
  task,
  isCompleted,
  isTaskStatusTogglingDisabled,
  isDependencyEmptyOrCompleted,
  taskListRestrictions,
  onCircleClick,
}) => {
  const [showCircleIconOnHover, setShowCircleIconOnHover] = useState(false);
  const [tooltipsOpen, setTooltipsOpen] = useState(false);

  const handleTooltipClose = () => {
    setTooltipsOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipsOpen(true);
  };

  return (
    <Tooltip
      placement={isCompleted ? 'bottom' : 'top'}
      title={
        isCompleted ? (
          <>
            <TootipCompletedBy>Completed by</TootipCompletedBy>
            <TootipCompletedByName>
              {`${task?.completedBy?.firstName} ${task?.completedBy?.lastName}`}
            </TootipCompletedByName>
            <TootipCompletedByDate>
              {`${new Date(task?.completedDt).toLocaleString('en-US', {
                weekday: 'long',
              })}, ${moment(task?.completedDt).format(
                'MMM DD, YYYY',
              )} @${new Date(task?.completedDt)
                .toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
                .toLowerCase()}`}
            </TootipCompletedByDate>
          </>
        ) : !task?.systemTask ? (
          'Complete task'
        ) : (
          'System task'
        )
      }
      open={tooltipsOpen}
      onClose={() => handleTooltipClose()}
    >
      <CircleIcon
        src={
          isCompleted
            ? task?.systemTask
              ? TaskAutomationComplete
              : CircleCompleted
            : showCircleIconOnHover
            ? task?.systemTask
              ? TaskAutomationPending
              : CircleCompletedHover
            : task?.systemTask
            ? TaskAutomationPending
            : Circle
        }
        onMouseEnter={() => {
          setShowCircleIconOnHover(true);
          handleTooltipOpen();
        }}
        onMouseLeave={() => {
          setShowCircleIconOnHover(false);
          handleTooltipClose();
        }}
        isClickable={
          !isTaskStatusTogglingDisabled &&
          isDependencyEmptyOrCompleted &&
          taskListRestrictions?.completeTask !== DISABLED
        }
        isCompleted={isCompleted}
        onClick={
          // eslint-disable-next-line unicorn/no-negated-condition
          taskListRestrictions?.completeTask !== DISABLED && !task?.systemTask
            ? onCircleClick
            : () => {}
        }
      />
    </Tooltip>
  );
};

export default TaskItemCompleteIcon;
