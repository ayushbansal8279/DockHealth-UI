import React, { useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import DateLabel from 'components/common/DateLabel/DateLabel';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { useDispatch } from 'react-redux';
import spacing from 'styles/spacing';
import { AddPlaceholder } from '../TaskTemplateDueDate/styled';

const TaskTemplateStartDate = (props) => {
  const { workflow, disabled = false, isDateHover } = props;
  const { identifier, startDateTime } = workflow || {};
  const dispatch = useDispatch();

  const handleStartDateChange = useCallback(
    (updatedDate) => {
      const payload = {
        startDateTime: updatedDate,
      };

      if (!updatedDate) payload.startDateTimeCleared = true;

      dispatch(updatePartialWorkflow(identifier, payload));
    },
    [dispatch, identifier],
  );

  return (
    <TaskItemPopover
      disabled={disabled}
      content={({ closePopover }) => (
        <DueDatePicker
          taskIdentifier={identifier}
          selectedDate={startDateTime}
          disableRecurring
          onDateChange={handleStartDateChange}
          onCloseClick={closePopover}
        />
      )}
    >
      {/* <Tooltip
        placement="top"
        title={startDateTime ? 'Edit Start Date' : 'Add Start Date'}
      > */}
      {startDateTime ? (
        <DateLabel date={startDateTime} tootipTitle="Edit Start Date" />
      ) : (
        <>
          {isDateHover ? (
            <Tooltip placement="top" title="Add Due Date">
              <AddPlaceholder>
                <div style={{ display: 'flex' }}>
                  <TaskIcon type="calendar" isActive={true} />
                  <p
                    style={{
                      padding: `2px ${spacing.smallPlus}`,
                    }}
                  >
                    None
                  </p>
                </div>
              </AddPlaceholder>
            </Tooltip>
          ) : null}
        </>
      )}
      {/* </Tooltip> */}
    </TaskItemPopover>
  );
};

export default TaskTemplateStartDate;
