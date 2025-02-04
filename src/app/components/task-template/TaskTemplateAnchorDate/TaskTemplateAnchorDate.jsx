import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import moment from 'moment';
import { checkDateTimeIntent, DueDateIntent } from '@/app/helpers/task-helpers';
import { formatDateTime } from '@/app/helpers/date-intent-helpers';

const TaskTemplateAnchorDate = (props) => {
  const { workflow } = props;
  const { identifier, anchorDateTime, anchorDateIntent } = workflow || {};
  const dispatch = useDispatch();

  const handleAnchorDateChange = useCallback(
    (updatedDate) => {
      const anchorDateIntent = checkDateTimeIntent(updatedDate);
      const payload = {
        anchorDateTime: formatDateTime(updatedDate, anchorDateIntent),
        anchorDateIntent: updatedDate ? anchorDateIntent : DueDateIntent.DATE,
      };

      const modalProps = {
        confirm: async () => {
          if (!updatedDate) payload.anchorDateTimeCleared = true;
          dispatch(updatePartialWorkflow(identifier, payload));

          dispatch(closeModal());
        },
      };
      dispatch(openModal('AnchorDateChangeConfirmation', modalProps));
    },
    [dispatch, identifier],
  );

  return (
    <TaskItemPopover
      content={({ closePopover }) => (
        <DueDatePicker
          taskIdentifier={identifier}
          selectedDate={adjustUTCDateForDateIntent(anchorDateTime ? moment(anchorDateTime).local() : null, anchorDateIntent)}
          disableRecurring
          onDateChange={handleAnchorDateChange}
          onCloseClick={closePopover}
          dueDateIntent={anchorDateIntent}
          dateType="dueDate"
        />
      )}
    >
      {/* <Tooltip
        placement="top"
        title={anchorDateTime ? 'Edit Anchor Date' : 'Add Anchor Date'}
      > */}
      {anchorDateTime ? (
        <DateLabel 
          date={anchorDateTime} 
          tootipTitle="Edit Anchor Date" 
          dueDateIntent={anchorDateIntent}
        />
      ) : (
        <Tooltip placement="top" title="Add Anchor Date">
          <div>
            <TaskIcon type="calendar" />
          </div>
        </Tooltip>
      )}
      {/* </Tooltip> */}
    </TaskItemPopover>
  );
};

export default TaskTemplateAnchorDate;
