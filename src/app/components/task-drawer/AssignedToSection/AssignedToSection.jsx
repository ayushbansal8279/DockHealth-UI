/* eslint-disable react/jsx-no-duplicate-props */
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import { pluck, trim } from 'ramda';
import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AdornmentClear } from '../styled';
import TextInput from '../TextInput/TextInput';

const ASSIGNED_TO_USERS_FIELD_NAME = 'assignedToUsers';

const AssignedToSection = ({ assignedToUsers, taskListIdentifier, onSave }) => {
  const { register, unregister, setValue, watch } = useFormContext();

  const assignedToUsersValue = watch(ASSIGNED_TO_USERS_FIELD_NAME);

  useEffect(() => {
    register(ASSIGNED_TO_USERS_FIELD_NAME);
    return () => {
      unregister(ASSIGNED_TO_USERS_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(ASSIGNED_TO_USERS_FIELD_NAME, assignedToUsers);
  }, [assignedToUsers, setValue]);

  const displayValue =
    pluck('userName', assignedToUsersValue || [])
      .map(trim)
      .join(', ') || '';

  const handleClearAssignedToUsers = useCallback(() => {
    setValue(ASSIGNED_TO_USERS_FIELD_NAME, []);
    onSave({
      assignedToUsers: [],
    });
  }, [setValue, onSave]);

  const handleAssignToSelection = useCallback(
    selectedMembers => {
      setValue(ASSIGNED_TO_USERS_FIELD_NAME, selectedMembers);
      onSave({
        assignedToUsers: selectedMembers,
      });
    },
    [onSave, setValue],
  );

  return (
    <MultiAssignPopover
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
          tabindex: -1,
          readOnly: true,
          value: displayValue,
        }}
      />
    </MultiAssignPopover>
  );
};

export default AssignedToSection;
