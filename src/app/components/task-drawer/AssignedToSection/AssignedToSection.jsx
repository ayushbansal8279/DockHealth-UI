/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect } from 'react';
import { pluck, trim } from 'ramda';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { onTaskDrawerTaskAssigned } from 'helpers/ga-event-helper';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import { AdornmentClear } from '../styled';
import TextInput from '../TextInput/TextInput';

const ASSIGNED_TO_USERS_FIELD_NAME = 'assignedToUsers';

const AssignedToSection = ({
  assignedToUsers,
  taskListIdentifier = null,
  onSave,
}) => {
  const { register, unregister, setValue, watch } = useFormContext();
  const currentUser = useSelector(userProfileSelector);

  const assignedToUsersValue = watch(ASSIGNED_TO_USERS_FIELD_NAME);

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
    pluck('userName', assignedToUsersValue || [])
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
    <MultiAssignPopover
      fullWidth
      taskListIdentifiers={taskListIdentifier}
      selectedMembers={assignedToUsersValue}
      onSelect={handleAssignToSelection}
    >
      <TextInput
        type="text"
        label="Assigned to"
        placeholder="Who would you like to assign this task to?"
        multiple
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: assignedToUsers?.length > 0 && (
            <AdornmentClear onClick={handleClearAssignedToUsers} />
          ),
        }}
        inputProps={{
          tabIndex: -1,
          readOnly: true,
          value: displayValue,
        }}
      />
    </MultiAssignPopover>
  );
};

export default AssignedToSection;
