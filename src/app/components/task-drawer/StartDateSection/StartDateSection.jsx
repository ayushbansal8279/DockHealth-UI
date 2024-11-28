import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { updateTaskStartDate } from 'actions/task-actions';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { StartDateSectionWrapper, AddStartDateButton } from './styled';
import {
  StyledPopover,
  Title,
  SubTitle,
  DateViewContainer,
  DateViewText,
} from '../DueDateSection/styled';
import { isStartDateValid } from '@/app/helpers/date-validation-helper';
import { openModal } from '@/app/modal/actions';

const StartDateSection = ({
  selectedTask,
  disabled = false,
  addTaskDrawer,
  setStartDate,
}) => {
  const dispatch = useDispatch();
  const { taskIdentifier, startDate, dueDate, hasRecurringSchedule } =
    selectedTask || {};
  const [momentStartDate, setMomentStartDate] = useState(
    startDate ? moment(startDate) : null,
  );
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const buttonReference = useRef(null);
  const startDateRef = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const [isTimeAvailable, setIsTimeAvailable] = useState(false);
  const handleSave = useCallback(
    (updatedStartDateTime) => {
      if (updatedStartDateTime === null) {
        setMomentStartDate(updatedStartDateTime ? moment(updatedStartDateTime) : null);
        setIsTimeAvailable(updatedStartDateTime ? true : false);
      }
      if (addTaskDrawer) {
        setStartDate(updatedStartDateTime);
        setMomentStartDate(moment(updatedStartDateTime));
      } else {
        setMomentStartDate(
          !!updatedStartDateTime ? moment(updatedStartDateTime) : null,
        );
        dispatch(updateTaskStartDate(selectedTask, updatedStartDateTime));
      }
    },
    [dispatch, selectedTask],
  );

  const handleStartDateSave = useCallback(
    (newStartDate) => {
      setMomentStartDate(moment(newStartDate));
      const isDateValid = isStartDateValid(dueDate, newStartDate);
      if (isDateValid) {
        handleSave(newStartDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'startDate',
            onSave: () => handleSave(newStartDate),
          }),
        );
      }
    },
    [dispatch, selectedTask],
  );

  useEffect(() => {
    if (momentStartDate && (momentStartDate.hour() || momentStartDate.minute())) {
      setIsTimeAvailable(true);
    } else {
      setIsTimeAvailable(false);
    }
  }, [momentStartDate]);

  return (
    <StartDateSectionWrapper
      ref={startDateRef}
      disabled={isTemplateTask || disabled}
    >
      <Title>Start date</Title>
      {!momentStartDate && (
        <AddStartDateButton
          ref={buttonReference}
          onClick={(event) => {
            event.stopPropagation();
            openPopover(true);
          }}
        >
          <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
        </AddStartDateButton>
      )}
      {momentStartDate && (
        <DateViewContainer>
          <DateViewText
            ref={buttonReference}
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            {momentStartDate.format('MMM DD, YYYY')}
          </DateViewText>
        </DateViewContainer>
      )}
      {isTimeAvailable && (
        <DateViewContainer>
          <DateViewText
            ref={buttonReference}
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            {momentStartDate.format('hh:mm a')}
          </DateViewText>
        </DateViewContainer>
      )}
      <StyledPopover
        anchorEl={startDateRef?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ marginLeft: '103px' }}
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
                selectedDate={momentStartDate}
                onDateChange={handleStartDateSave}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
              />
            </Box>
          </PopoverCard>
        )}
      </StyledPopover>
    </StartDateSectionWrapper>
  );
};

export default StartDateSection;
