import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { openModal, closeModal } from 'modal/actions';
import {
  AnchorDateContentWrapper,
  AnchorDateSectionWrapper,
  Title,
  DateViewContainer,
} from './styled';
import {
  DateViewText,
  SubTitle,
  NoDateContainer,
} from '../DueDateSection/styled';
import AssignMemberIcon from '../../user/AssignMemberIcon/AssingMemberIcon';
import { checkDateTimeIntent, DueDateIntent } from '@/app/helpers/task-helpers';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import { formatDateBasedOnIntent, formatDateTime, shouldDisplayTime } from '@/app/helpers/date-intent-helpers';

const AnchorDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, anchorDateTime, hasRecurringSchedule, anchorDateIntent } =
    selectedWorkflow || {};
  const momentAnchorDate = anchorDateTime ? moment(anchorDateTime) : null;

  const handleAnchorDateSave = useCallback(
    (date) => {
      const anchorDateIntent = checkDateTimeIntent(date);
      const payload = {
        anchorDateTime: formatDateTime(date, anchorDateIntent),
        anchorDateIntent: date ? anchorDateIntent : DueDateIntent.DATE,
      };

      const modalProps = {
        confirm: async () => {
          if (!date) payload.anchorDateTimeCleared = true;
          dispatch(
            updatePartialWorkflow(selectedWorkflow?.identifier, payload),
          );
          dispatch(closeModal());
        },
      };
      dispatch(openModal('AnchorDateChangeConfirmation', modalProps));
    },
    [dispatch, selectedWorkflow],
  );

  return (
    <AnchorDateSectionWrapper>
      <Title>Anchor date</Title>
      <TaskDrawerPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={adjustUTCDateForDateIntent(anchorDateTime ? moment(anchorDateTime).local() : null, anchorDateIntent)}
            onDateChange={handleAnchorDateSave}
            recurring={hasRecurringSchedule}
            disableRecurring
            onCloseClick={closePopover}
            dueDateIntent={anchorDateIntent}
            dateType="dueDate"
          />
        )}
      >
        <AnchorDateContentWrapper>
          {momentAnchorDate ? (
            <>
              <DateViewContainer>
                <DateViewText>
                  {formatDateBasedOnIntent(momentAnchorDate, anchorDateIntent)}
                </DateViewText>
              </DateViewContainer>
              {shouldDisplayTime(momentAnchorDate, anchorDateIntent) && (
                  <DateViewContainer>
                    <DateViewText>
                      {momentAnchorDate?.format('hh:mm a')}
                    </DateViewText>
                  </DateViewContainer>
                )
              }
            </>
          ) : (
            <NoDateContainer>
              <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
            </NoDateContainer>
          )}
        </AnchorDateContentWrapper>
      </TaskDrawerPopover>
    </AnchorDateSectionWrapper>
  );
};

export default AnchorDateSection;
