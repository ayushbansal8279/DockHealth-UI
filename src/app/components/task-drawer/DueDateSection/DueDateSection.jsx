import React from 'react';
import moment from 'moment';
import RecurringIcon from 'img/recurring-arrows';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import { checkIfTemplateTask, isDueDateOverdue } from 'helpers/task-helpers';
import DueDatePickerPopover from 'components/task/DueDatePicker/DueDatePickerPopover';
import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  DueDateContentWrapper,
  DueDateContent,
  DueDateSectionWrapper,
  DueDateLabel,
  Placeholder,
  DueDateText,
} from './styled';
import { AdornmentClear } from '../styled';

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

  return (
    <DueDateSectionWrapper disabled={isTemplateTask}>
      <DueDateLabel>Due date</DueDateLabel>
      <DueDatePickerPopover
        taskIdentifier={taskIdentifier}
        disabled={isTemplateTask}
        selectedDate={dueDate}
        onDateChange={onDueDateChange}
        recurring={hasRecurringSchedule}
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
                      <>
                        <RecurringIcon />
                        <Spacing horizontal={3} />
                      </>
                    </Tooltip>
                  </>
                )}
              </DueDateText>
              <DueDateText>{formatDueTime(dueDate)}</DueDateText>
              <AdornmentClear onClick={() => onDueDateChange(null)} />
            </DueDateContent>
          ) : (
            <Placeholder>
              {!isTemplateTask
                ? 'Set a due date?'
                : 'Not available when creating a template'}
            </Placeholder>
          )}
        </DueDateContentWrapper>
      </DueDatePickerPopover>
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
