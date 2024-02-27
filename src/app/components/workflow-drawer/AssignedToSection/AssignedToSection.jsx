/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import pluck from 'ramda/src/pluck';
import trim from 'ramda/src/trim';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import Input from 'components/common/Input/Input';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { AdornmentClear } from '../styled';

const AssignedToSection = ({ disabled }) => {
  const currentUser = useSelector(userProfileSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const { assignedToUsers, taskList, taskListIdentifier } =
    selectedWorkflow || {};
  const [assignedToUsersValue, setAssignedToUsersValue] = useState();
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.ASSIGNED_TO
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const handleClearAssignedToUsers = useCallback(() => {
    setAssignedToUsersValue([]);
    dispatch(
      updatePartialWorkflow(selectedWorkflow?.identifier, {
        assignedToUsers: [],
        assignedToIdentifiers: [],
      }),
    );
  }, [dispatch, selectedWorkflow]);

  const handleAssignToSelection = useCallback(
    (selectedMembers) => {
      setAssignedToUsersValue(selectedMembers);
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        }),
      );
    },
    [dispatch, selectedWorkflow],
  );

  return (
    <TaskDrawerPopover
      content={({ closePopover }) =>
        !disabled && (
          <MultiAssignMembersList
            taskListIdentifiers={taskListIdentifier}
            selectedMembers={assignedToUsersValue}
            onSelect={handleAssignToSelection}
            enableLazyLoading={
              taskList?.listType === 'PUBLIC' ||
              taskList?.listType === 'TEMPLATE'
            }
            closeModel={closePopover}
          />
        )
      }
    >
      <Input
        disabled={disabled}
        inputRef={inputReference}
        name="assignTo"
        type="text"
        label="Assigned to"
        placeholder="Who would you like to assign this workflow to?"
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
