import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import {
  checkDateTimeIntent,
  checkIfTemplateTask,
  DueDateIntent,
} from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { updateTaskStartDate } from 'actions/task-actions';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { StartDateSectionWrapper, AddStartDateButton, DateViewContainer } from './styled';
import {
  StyledPopover,
  Title,
  SubTitle,
  DateViewText,
} from '../DueDateSection/styled';
import { isStartDateValid } from '@/app/helpers/date-validation-helper';
import { openModal } from '@/app/modal/actions';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import {
  formatDateBasedOnIntent,
  shouldDisplayTime,
} from '@/app/helpers/date-intent-helpers';

const StartDateSection = ({
  selectedTask,
  disabled = false,
  addTaskDrawer,
  setStartDate,
  defaultStartDateIntent,
  setStartDateIntent,
}) => {
  const dispatch = useDispatch();
  const {
    taskIdentifier,
    startDate,
    startDateIntent,
    dueDate,
    hasRecurringSchedule,
  } = selectedTask || {};
  const [momentStartDate, setMomentStartDate] = useState(
    startDate ? moment(startDate) : null,
  );
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const buttonReference = useRef(null);
  const startDateRef = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const handleSave = useCallback(
    (updatedStartDateTime) => {
      if (addTaskDrawer) {
        setStartDate(updatedStartDateTime);
        setMomentStartDate(
          !!updatedStartDateTime ? moment(updatedStartDateTime) : null,
        );
        const defaultStartDateIntent =
          checkDateTimeIntent(updatedStartDateTime);
        setStartDateIntent(defaultStartDateIntent);
      } else {
        setMomentStartDate(
          !!updatedStartDateTime ? moment(updatedStartDateTime) : null,
        );
        const startDateIntent = checkDateTimeIntent(updatedStartDateTime);
        dispatch(
          updateTaskStartDate(
            selectedTask,
            updatedStartDateTime,
            startDateIntent,
          ),
        );
      }
    },
    [dispatch, selectedTask],
  );

  const handleStartDateSave = useCallback(
    (newStartDate) => {
      const isDateValid = isStartDateValid(dueDate, newStartDate);
      setMomentStartDate(moment(newStartDate));
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
            {formatDateBasedOnIntent(
              momentStartDate,
              startDateIntent ? startDateIntent : defaultStartDateIntent,
            )}
          </DateViewText>
        </DateViewContainer>
      )}
      {shouldDisplayTime(
        momentStartDate,
        startDateIntent ? startDateIntent : defaultStartDateIntent,
      ) && (
        <DateViewContainer>
          <DateViewText
            ref={buttonReference}
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            {momentStartDate?.format('hh:mm a')}
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
                selectedDate={adjustUTCDateForDateIntent(
                  momentStartDate?.local(),
                  startDateIntent ? startDateIntent : defaultStartDateIntent,
                )}
                onDateChange={handleStartDateSave}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
                dueDateIntent={
                  startDateIntent ? startDateIntent : defaultStartDateIntent
                }
                dateType="dueDate"
              />
            </Box>
          </PopoverCard>
        )}
      </StyledPopover>
    </StartDateSectionWrapper>
  );
};

export default StartDateSection;
