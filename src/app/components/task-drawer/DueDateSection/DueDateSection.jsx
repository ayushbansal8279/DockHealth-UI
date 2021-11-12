import React from 'react';
import moment from 'moment';
import { Box } from '@material-ui/core';
import RecurringIcon from 'img/recurring-arrows';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import { checkIfTemplateTask, isDueDateOverdue } from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Input from 'components/common/Input/Input';
import {
  DueDateContentWrapper,
  DueDateContent,
  DueDateSectionWrapper,
  Placeholder,
  DueDateText,
} from './styled';
import { AdornmentClear } from '../styled';
import TaskDrawerPopover from '../TaskDrawerPopover/TaskDrawerPopover';

function formatDueTime(dueDate) {
  if (!dueDate) return null;

  const dueTime = moment(dueDate).format(TIME_12H_FORMAT);

  if (
    dueTime.toLowerCase() === '12:00 am' ||
    dueTime.toLowerCase() === '00:00 am'
  ) {
    return null;
  }

  return dueTime;
}

const DueDateSection = ({ selectedTask, onDueDateChange }) => {
  const { taskIdentifier, dueDate, hasRecurringSchedule } = selectedTask || {};
  const momentDueDate = dueDate ? moment(dueDate) : null;
  const isTemplateTask = checkIfTemplateTask(selectedTask);

  const sectionDisabled = isTemplateTask || !taskIdentifier;

  return (
    <DueDateSectionWrapper disabled={isTemplateTask}>
      {/* <DueDateLabel>Due date</DueDateLabel> */}
      <Input
        label="Due date"
        shrink
        customInputComponent={() => (
          <TaskDrawerPopover
            disabled={sectionDisabled}
            content={({ closePopover }) => (
              <DueDatePicker
                taskIdentifier={taskIdentifier}
                selectedDate={dueDate}
                onDateChange={onDueDateChange}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
              />
            )}
          >
            <DueDateContentWrapper>
              {momentDueDate ? (
                <DueDateContent error={isDueDateOverdue(selectedTask)}>
                  <DueDateText>
                    {momentDueDate.format('MM/DD/YY')}
                    {hasRecurringSchedule && (
                      <>
                        <Spacing horizontal={3} />
                        <Tooltip title="Recurring Task" placement="right">
                          <Box display="inline-block">
                            <RecurringIcon />
                          </Box>
                        </Tooltip>
                      </>
                    )}
                  </DueDateText>
                  <DueDateText>{formatDueTime(dueDate)}</DueDateText>
                  {!sectionDisabled && (
                    <AdornmentClear
                      style={{ position: 'relative', top: '-6px' }}
                      onClick={() => onDueDateChange(null)}
                    />
                  )}
                </DueDateContent>
              ) : (
                <Placeholder>
                  {!isTemplateTask
                    ? 'Set a due date?'
                    : 'Not available when creating a template'}
                </Placeholder>
              )}
            </DueDateContentWrapper>
          </TaskDrawerPopover>
        )}
      />
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
