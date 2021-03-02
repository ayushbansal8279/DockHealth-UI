import React, { useMemo } from 'react';
import { innerJoin } from 'ramda';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import { WrapperContainer, IconBox, AssigneeIcon } from './styled';

const BulkEditAssignToOption = ({
  selectedTasks,
  handleChangeAssigneTasks,
  selectedTaskListIdentifiers,
  isDisabled,
}) => {
  const joinedSelectedMembers = useMemo(() => {
    const { parentTasks = [], subtasks = [] } = selectedTasks || {};

    const allSelectedTasks = [...parentTasks, ...subtasks];

    return allSelectedTasks.reduce((accumulator, { assignedToUsers }) => {
      if (accumulator.length === 0) return accumulator.concat(assignedToUsers);

      return innerJoin(
        (existingRecord, newRecord) =>
          existingRecord.userIdentifier === newRecord.userIdentifier,
        accumulator,
        assignedToUsers,
      );
    }, []);
  }, [selectedTasks]);

  return (
    <MultiAssignPopover
      taskListIdentifiers={selectedTaskListIdentifiers}
      selectedMembers={joinedSelectedMembers}
      onSelect={handleChangeAssigneTasks}
      isDisabled={isDisabled}
    >
      <WrapperContainer disabled={isDisabled}>
        <IconBox>
          <AssigneeIcon />
        </IconBox>
        <p>Assignee</p>
      </WrapperContainer>
    </MultiAssignPopover>
  );
};
export default BulkEditAssignToOption;
