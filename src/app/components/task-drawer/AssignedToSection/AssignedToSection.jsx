/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useMemo } from 'react';
import { pluck, trim } from 'ramda';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { onTaskDrawerTaskAssigned } from 'helpers/ga-event-helper';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import Input from 'components/common/Input/Input';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { AdornmentClear } from '../styled';

const ASSIGNED_TO_USERS_FIELD_NAME = 'assignedToUsers';

const AssignedToSection = ({ onSave }) => {
  const { register, unregister, setValue, watch } = useFormContext();
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const { assignedToUsers, taskList } = selectedTask;
  const assignedToUsersValue = watch(ASSIGNED_TO_USERS_FIELD_NAME);
  const isTemplateTask = useMemo(() => checkIfTemplateTask(selectedTask), [
    selectedTask,
  ]);
  const currentTaskListIdentifier = taskList?.taskListIdentifier;
  const taskListIdentifier = isTemplateTask ? null : currentTaskListIdentifier;

  useEffect(() => {
    register(ASSIGNED_TO_USERS_FIELD_NAME);
    return () => {
      unregister(ASSIGNED_TO_USERS_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(ASSIGNED_TO_USERS_FIELD_NAME, assignedToUsers || []);
  }, [assignedToUsers, setValue]);

  const wholeDisplayValue =
    pluck('name', assignedToUsersValue || [])
      .map(trim)
      .join(', ') || '';

  const displayValue =
    wholeDisplayValue.length > 78
      ? `${wholeDisplayValue.slice(0, 78)} ...`
      : wholeDisplayValue;

  const handleClearAssignedToUsers = useCallback(() => {
    setValue(ASSIGNED_TO_USERS_FIELD_NAME, []);
    onTaskDrawerTaskAssigned();
    onSave({
      assignedBy: null,
      assignedToUsers: [],
      assignedToIdentifiers: [],
    });
  }, [setValue, onSave]);

  const handleAssignToSelection = useCallback(
    selectedMembers => {
      setValue(ASSIGNED_TO_USERS_FIELD_NAME, selectedMembers);
      onTaskDrawerTaskAssigned();
      onSave({
        assignedBy: selectedMembers?.length ? currentUser : null,
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
      });
    },
    [currentUser, onSave, setValue],
  );

  return (
    <TaskDrawerPopover
      content={() => (
        <MultiAssignMembersList
          taskListIdentifiers={taskListIdentifier}
          selectedMembers={assignedToUsersValue}
          onSelect={handleAssignToSelection}
          enableLazyLoading={
            taskList?.listType === 'PUBLIC' || taskList?.listType === 'TEMPLATE'
          }
        />
      )}
    >
      <Input
        name="assignTo"
        type="text"
        label="Assigned to"
        placeholder="Who would you like to assign this task to?"
        multiple
        value={displayValue}
        endAdornment={
          assignedToUsers?.length > 0 && (
            <AdornmentClear onClick={handleClearAssignedToUsers} />
          )
        }
      />
    </TaskDrawerPopover>
  );
};

export default AssignedToSection;
