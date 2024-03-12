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
  PopupContainer,
} from './styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { event } from 'react-ga';

const AssignedToSection = ({ selectedTask = {}, onSave, disabled }) => {
  const currentUser = useSelector(userProfileSelector);
  const { assignedToUsers, taskList } = selectedTask || {};
  const isTemplateTask = useMemo(
    () => checkIfTemplateTask(selectedTask),
    [selectedTask],
  );
  const currentTaskListIdentifier = taskList?.taskListIdentifier;
  const taskListIdentifier = isTemplateTask ? null : currentTaskListIdentifier;
  const [assignedToUsersValue, setAssignedToUsersValue] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isPopoverOpen, setIsOpen] = useState(false);

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

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
  };
  
  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <AssignMemberContainer>
        <Title>Assign to</Title>
        {assignedToUsers &&
          assignedToUsers.map((user) => (
            <AssigneeContainer>
              <UserAvatar user={user} />
              {assignedToUsers?.length <= 2 ? (
                <AssigneeTitle>{displayName(user.userName)}</AssigneeTitle>
              ) : (
                ''
              )}
              {YouBadge(user)}
            </AssigneeContainer>
          ))}
        <TextField
          variant="outlined"
          placeholder="Add Assignee"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
            },
            width: '200px',
            marginLeft: '10px',
          }}
          inputProps={{
            autoComplete: 'off',
            value: searchValue,
            onChange: handleInputChange,
            onClick: handleClick,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label="search">
                  <AssignMemberIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </AssignMemberContainer>

      {isPopoverOpen && (
        <PopupContainer width={245}>
          <MultiAssignMembersList
            value={searchValue}
            setValue={setSearchValue}
            // width={245}
            taskDrawer
            closePopup={setIsOpen}
            taskListIdentifiers={taskListIdentifier}
            selectedMembers={assignedToUsersValue}
            onSelect={handleAssignToSelection}
            enableLazyLoading={
              taskList?.listType === 'PUBLIC' ||
              taskList?.listType === 'TEMPLATE'
            }
            additionalMembers={selectedTask?.sharedWithUsers || []}
          />
        </PopupContainer>
      )}
    </div>
  );
};

export default AssignedToSection;
