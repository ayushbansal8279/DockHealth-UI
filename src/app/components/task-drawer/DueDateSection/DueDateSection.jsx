import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import RecurringIcon from 'img/recurring-arrows';
import {
  checkIfTemplateTask,
  isDueDateOverdue,
  ReminderType,
} from 'helpers/task-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import Spacing from 'components/common/Spacing';
import { updateTaskDueDate } from 'actions/task-actions';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import ReminderIcon from 'img/reminder';
import {
  DueDateSectionWrapper,
  StyledPopover,
  Title,
  AddDateButton,
  SubTitle,
  DateViewContainer,
  DateViewText,
  RecurringIconContainer,
  ReminderIconContainer,
} from './styled';
import { openModal } from '@/app/modal/actions';
import { isDueDateValid } from '@/app/helpers/date-validation-helper';

const DueDateSection = ({
  selectedTask,
  disabled = false,
  addTaskDrawer,
  setDueDate,
}) => {
  const dispatch = useDispatch();
  const {
    taskIdentifier,
    startDate,
    dueDate,
    hasRecurringSchedule,
    reminderType,
  } = selectedTask || {};
  const [momentDueDate, setMomentDueDate] = useState(
    dueDate ? moment(dueDate) : null,
  );
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const buttonReference = useRef(null);
  const dueDateRef = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [isTimeAvailable, setIsTimeAvailable] = useState(false);
  const handleSave = useCallback(
    (updatedDueDateTime) => {
      if (updatedDueDateTime === null) {
        setIsTimeAvailable(false);
      }
      if (addTaskDrawer) {
        setDueDate(updatedDueDateTime);
        setMomentDueDate(moment(updatedDueDateTime));
      } else {
        setMomentDueDate(
          !!updatedDueDateTime ? moment(updatedDueDateTime) : null,
        );
        dispatch(updateTaskDueDate(selectedTask, updatedDueDateTime));
      }
    },
    [dispatch, selectedTask],
  );

  const handleDueDateSave = useCallback(
    (newDueDate) => {
      setMomentDueDate(newDueDate ? moment(newDueDate) : null);
      const isDateValid = isDueDateValid(startDate, newDueDate);
      if (isDateValid) {
        handleSave(newDueDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'dueDate',
            onSave: () => handleSave(newDueDate),
          }),
        );
      }
    },
    [dispatch, selectedTask],
  );

  useEffect(() => {
    setIsOverdue(isDueDateOverdue(selectedTask));
    if (momentDueDate && (momentDueDate.hour() || momentDueDate.minute())) {
      setIsTimeAvailable(true);
    }
  }, [selectedTask]);

  return (
    <DueDateSectionWrapper
      ref={dueDateRef}
      disabled={isTemplateTask || disabled}
    >
      <Title>Due date</Title>
      {!momentDueDate && (
        <AddDateButton
          ref={buttonReference}
          onClick={(event) => {
            event.stopPropagation();
            openPopover(true);
          }}
        >
          <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
        </AddDateButton>
      )}
      {momentDueDate && (
        <DateViewContainer isOverdue={isOverdue}>
          <DateViewText
            ref={buttonReference}
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            {momentDueDate.format('MMM DD, YYYY')}
          </DateViewText>
        </DateViewContainer>
      )}
      {isTimeAvailable && (
        <DateViewContainer isOverdue={isOverdue}>
          <DateViewText
            ref={buttonReference}
            onClick={(event) => {
              event.stopPropagation();
              openPopover(true);
            }}
          >
            {momentDueDate.format('hh:mm a')}
          </DateViewText>
        </DateViewContainer>
      )}
      {hasRecurringSchedule && (
        <RecurringIconContainer isOverdue={isOverdue}>
          <Spacing horizontal={2} />
          <RecurringIcon />
        </RecurringIconContainer>
      )}
      {reminderType && reminderType !== ReminderType.NONE && (
        <ReminderIconContainer isOverdue={isOverdue}>
          <Spacing horizontal={2} />
          <ReminderIcon />
        </ReminderIconContainer>
      )}
      <StyledPopover
        anchorEl={dueDateRef?.current}
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
                selectedDate={momentDueDate}
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
