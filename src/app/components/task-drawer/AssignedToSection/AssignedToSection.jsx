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
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import {
  AssignMemberContainer,
  AddAssigneeButton,
  Title,
  SubTitle,
  AssigneeContainer,
  AssigneeTitle,
  StyledYouBadge,
} from './styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';

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

  const displayName = (userName) => {
    return userName.length > 20 ? `${userName.slice(0, 20)} ...` : userName;
  };

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

  const YouBadge = (user) => {
    if (user.identifier === currentUser.identifier)
      return <StyledYouBadge>You</StyledYouBadge>;
  };

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
      <AssignMemberContainer>
        <Title>Assign to</Title>
        {assignedToUsers &&
          assignedToUsers.map((user) => (
            <AssigneeContainer>
              <UserAvatar user={user} />
              {assignedToUsers?.length <= 3 ? (
                <AssigneeTitle>{displayName(user.userName)}</AssigneeTitle>
              ) : (
                ''
              )}
              {YouBadge(user)}
            </AssigneeContainer>
          ))}

        <AddAssigneeButton>
          <AssignMemberIcon />
          {assignedToUsers && assignedToUsers.length === 0 ? (
            <SubTitle>Add Assignee</SubTitle>
          ) : null}
        </AddAssigneeButton>
      </AssignMemberContainer>
    </TaskDrawerPopover>
  );
};

export default AssignedToSection;
