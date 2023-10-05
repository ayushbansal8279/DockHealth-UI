/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import pluck from 'ramda/src/pluck';
import trim from 'ramda/src/trim';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { onTaskDrawerTaskAssigned } from 'helpers/ga-event-helper';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import Input from 'components/common/Input/Input';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { AdornmentClear } from '../styled';

const AssignedToSection = ({ selectedTask = {}, onSave, disabled }) => {
  const currentUser = useSelector(userProfileSelector);
  const { assignedToUsers, taskList } = selectedTask || {};
  const isTemplateTask = useMemo(
    () => checkIfTemplateTask(selectedTask),
    [selectedTask],
  );
  const currentTaskListIdentifier = taskList?.taskListIdentifier;
  const taskListIdentifier = isTemplateTask ? null : currentTaskListIdentifier;
  const [assignedToUsersValue, setAssignedToUsersValue] = useState();

  useEffect(() => {
    setAssignedToUsersValue(assignedToUsers || []);
  }, [assignedToUsers]);

  const wholeDisplayValue =
    pluck('name', assignedToUsersValue || [])
      .map(trim)
      .join(', ') || '';

  const displayValue =
    wholeDisplayValue.length > 78
      ? `${wholeDisplayValue.slice(0, 78)} ...`
      : wholeDisplayValue;

  const handleClearAssignedToUsers = useCallback(() => {
    setAssignedToUsersValue([]);

    onTaskDrawerTaskAssigned();
    onSave({
      assignedToUsers: [],
      assignedToIdentifiers: [],
    });
  }, [onSave]);

  const handleAssignToSelection = useCallback(
    (selectedMembers) => {
      setAssignedToUsersValue(selectedMembers);
      onTaskDrawerTaskAssigned();
      onSave({
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
      });
    },
    [onSave],
  );

  return (
    <TaskDrawerPopover
      disabled={disabled}
      content={() => (
        <MultiAssignMembersList
          taskListIdentifiers={taskListIdentifier}
          selectedMembers={assignedToUsersValue}
          onSelect={handleAssignToSelection}
          enableLazyLoading={
            taskList?.listType === 'PUBLIC' || taskList?.listType === 'TEMPLATE'
          }
          additionalMembers={selectedTask?.sharedWithUsers || []}
        />
      )}
    >
      <Input
        disabled={disabled}
        name="assignTo"
        type="text"
        label="Assigned to"
        placeholder="Who would you like to assign this task to?"
        multiple
        value={displayValue}
        endAdornment={
          assignedToUsers?.length > 0 &&
          (disabled ? null : (
            <AdornmentClear onClick={handleClearAssignedToUsers} />
          ))
        }
      />
    </TaskDrawerPopover>
  );
};

export default AssignedToSection;
