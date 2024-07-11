import React, { useMemo } from 'react';
import innerJoin from 'ramda/src/innerJoin';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { AssigneeIcon } from './styled';

const BulkEditAssignToOption = ({
  selectedTasks,
  handleChangeAssigneTasks,
  selectedTaskListIdentifiers,
  isDisabled,
  isBulkEdit,
}) => {
  const selectedMemebers = useMemo(() => {
    const { parentTasks = [], subtasks = [] } = selectedTasks || {};

    const allSelectedTasks = [...parentTasks, ...subtasks];

    return (
      allSelectedTasks.reduce((accumulator, { assignedToUsers = [] }) => {
        if (accumulator === null) return assignedToUsers;

        return innerJoin(
          (existingRecord, newRecord) =>
            existingRecord.userIdentifier === newRecord.userIdentifier,
          accumulator || [],
          assignedToUsers,
        );
      }, null) || []
    );
  }, [selectedTasks]);

  const containPublicListType = useMemo(() => {
    const { parentTasks = [], subtasks = [] } = selectedTasks || {};
    const allSelectedTasks = [...parentTasks, ...subtasks];

    return !!allSelectedTasks?.find(
      ({ taskList }) =>
        taskList?.listType === 'PUBLIC' || taskList?.listType === 'TEMPLATE',
    );
  }, [selectedTasks]);

  return (
    <TaskItemPopover
      placement="top"
      contentWidth={230}
      content={({ closePopover }) => (
        <MultiAssignMembersList
          taskListIdentifiers={selectedTaskListIdentifiers}
          selectedMembers={selectedMemebers}
          isBulkTasks
          onSelect={handleChangeAssigneTasks}
          isDisabled={isDisabled}
          onError={closePopover}
          closeModel={closePopover}
          enableLazyLoading={containPublicListType}
          isBulkEdit={isBulkEdit}
        />
      )}
    >
      <BulkEditOption
        iconComponent={AssigneeIcon}
        title="Assignee"
        isDisabled={isDisabled}
      />
    </TaskItemPopover>
  );
};
export default BulkEditAssignToOption;
