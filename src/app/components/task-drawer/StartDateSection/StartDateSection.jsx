import React, { useCallback, useRef } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import { checkIfTemplateTask, isStartDateInPast } from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import Input from 'components/common/Input/Input';
import { updateTaskStartDate } from 'actions/task-actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { useBoolean } from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import { formatStartTime } from './helpers';
import { AdornmentClear } from '../styled';
import {
  StartDateContentWrapper,
  StartDateContent,
  StartDateSectionWrapper,
  Placeholder,
  StartDateText,
  StyledButton,
  StyledPopover,
} from './styled';

const StartDateSection = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskIdentifier, startDate, hasRecurringSchedule } =
    selectedTask || {};
  const momentStartDate = startDate ? moment(startDate) : null;
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const sectionDisabled = isTemplateTask || !taskIdentifier;
  const buttonReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const handleStartDateSave = useCallback(
    (updatedStartDateTime) => {
      dispatch(updateTaskStartDate(selectedTask, updatedStartDateTime));
    },
    [dispatch, selectedTask],
  );

  return (
    <StartDateSectionWrapper disabled={isTemplateTask}>
      <Input
        label="Start date"
        ref={buttonReference}
        shrink
        customInputComponent={() => (
          <StyledButton
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            <StartDateContentWrapper>
              {momentStartDate ? (
                <StartDateContent error={isStartDateInPast(selectedTask)}>
                  <StartDateText>
                    {momentStartDate.format('MM/DD/YY')}
                  </StartDateText>
                  <StartDateText>{formatStartTime(startDate)}</StartDateText>
                  {!sectionDisabled && (
                    <AdornmentClear
                      style={{ position: 'relative', top: '-6px' }}
                      onClick={() => handleStartDateSave(null)}
                    />
                  )}
                </StartDateContent>
              ) : (
                <Placeholder>
                  {!isTemplateTask
                    ? 'Set a start date?'
                    : 'Not available when creating a template'}
                </Placeholder>
              )}
            </StartDateContentWrapper>
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
        onClose={(event) => {
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
                selectedDate={startDate}
                onDateChange={handleStartDateSave}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
                disableRecurring
              />
            </Box>
          </PopoverCard>
        )}
      </StyledPopover>
    </StartDateSectionWrapper>
  );
};

export default StartDateSection;
