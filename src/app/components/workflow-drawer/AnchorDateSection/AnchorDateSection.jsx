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

const AnchorDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, anchorDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentAnchorDate = anchorDateTime ? moment(anchorDateTime) : null;
  const [isTimeAvailable, setIsTimeAvailable] = useState(false);

  const handleAnchorDateSave = useCallback(
    (date) => {
      if (date === null) {
        setIsTimeAvailable(false);
      }
      const payload = {
        anchorDateTime: date,
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

  useEffect(() => {
    if (
      momentAnchorDate &&
      (momentAnchorDate.hour() || momentAnchorDate.minute())
    ) {
      setIsTimeAvailable(true);
    }
  }, [momentAnchorDate]);

  return (
    <AnchorDateSectionWrapper>
      <Title>Anchor date</Title>
      <TaskDrawerPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={anchorDateTime}
            onDateChange={handleAnchorDateSave}
            recurring={hasRecurringSchedule}
            disableRecurring
            onCloseClick={closePopover}
          />
        )}
      >
        <AnchorDateContentWrapper>
          {momentAnchorDate ? (
            <DateViewContainer>
              <DateViewText>
                {momentAnchorDate.format('MMM DD, YYYY')}
              </DateViewText>
            </DateViewContainer>
          ) : (
            <NoDateContainer>
              <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
            </NoDateContainer>
          )}
          {isTimeAvailable && (
            <DateViewContainer>
              <DateViewText>{momentAnchorDate?.format('hh:mm a')}</DateViewText>
            </DateViewContainer>
          )}
        </AnchorDateContentWrapper>
      </TaskDrawerPopover>
    </AnchorDateSectionWrapper>
  );
};

export default AnchorDateSection;
