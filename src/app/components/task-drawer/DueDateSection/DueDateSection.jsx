import React from 'react';
import moment from 'moment';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import DueDatePicker from 'components/common/DueDatePicker/DueDatePicker';
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

const DueDateSection = ({
  dueDate,
  onDueDateChange,
  isOverdue,
  isTemplateTask,
}) => {
  const momentDueDate = dueDate ? moment(dueDate) : null;

  return (
    <DueDateSectionWrapper disabled={isTemplateTask}>
      <DueDateLabel>Due date</DueDateLabel>
      <DueDatePicker
        disabled={isTemplateTask}
        selectedDate={dueDate}
        onDateChange={onDueDateChange}
      >
        <DueDateContentWrapper>
          {momentDueDate ? (
            <DueDateContent error={isOverdue}>
              <DueDateText>{momentDueDate.format('YYYY/MM/DD')}</DueDateText>
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
      </DueDatePicker>
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
