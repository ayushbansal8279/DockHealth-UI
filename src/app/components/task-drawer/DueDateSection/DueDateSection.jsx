import React, { useCallback, useRef } from 'react';
import moment from 'moment';
import { Box } from '@material-ui/core';
import RecurringIcon from 'img/recurring-arrows';
import { checkIfTemplateTask, isDueDateOverdue } from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Input from 'components/common/Input/Input';
import { updateTaskDueDate } from 'actions/task-actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { useBoolean } from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { formatDueTime } from './helpers';
import { AdornmentClear } from '../styled';
import {
  DueDateContentWrapper,
  DueDateContent,
  DueDateSectionWrapper,
  Placeholder,
  DueDateText,
  StyledButton,
  StyledPopover,
} from './styled';

const DueDateSection = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskIdentifier, dueDate, hasRecurringSchedule } = selectedTask || {};
  const momentDueDate = dueDate ? moment(dueDate) : null;
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const sectionDisabled = isTemplateTask || !taskIdentifier;
  const buttonReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const handleDueDateSave = useCallback(
    updatedDueDateTime => {
      dispatch(updateTaskDueDate(selectedTask, updatedDueDateTime));
    },
    [dispatch, selectedTask],
  );

  return (
    <DueDateSectionWrapper disabled={isTemplateTask}>
      <Input
        label="Due date"
        ref={buttonReference}
        shrink
        customInputComponent={() => (
          <StyledButton
            type="button"
            onClick={event => {
              event.stopPropagation();
              openPopover(true);
            }}
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
                      onClick={() => handleDueDateSave(null)}
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
          </StyledButton>
        )}
      />
      <StyledPopover
        anchorEl={buttonReference?.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isPopoverOpen}
        onClose={event => {
          event.stopPropagation();
          closePopover();
        }}
        width="auto"
      >
        {isPopoverOpen && (
          <PopoverCard>
            <Box width="auto" minWidth={buttonReference.current?.offsetWidth}>
              <DueDatePicker
                taskIdentifier={taskIdentifier}
                selectedDate={dueDate}
                onDateChange={handleDueDateSave}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
              />
            </Box>
          </PopoverCard>
        )}
      </StyledPopover>
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
