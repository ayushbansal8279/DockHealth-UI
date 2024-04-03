/* eslint-disable react/jsx-no-duplicate-props */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import pluck from 'ramda/src/pluck';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { onTaskDrawerTaskAssigned } from 'helpers/ga-event-helper';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import {
  AssignMemberContainer,
  Title,
  AssigneeContainer,
  AssigneeTitle,
  StyledYouBadge,
  PopupContainer,
  HelperText,
} from './styled';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { Button, TextField } from '@mui/material';
import MemberGroup from '../../user/MemberGroup/MemberGroup';

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

  const inputRef = useRef(null);

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
    inputRef.current.focus();
  };

  const ButtonSx = {
    height: '40px',
    borderRadius: '4px',
    borderColor: 'transparent',
    backgroundColor: isPopoverOpen ? '#f8f8f9' : 'transparent',
    '&:hover': {
      backgroundColor: '#f8f8f9',
      borderColor: 'transparent',
    },
    '&:active': {
      backgroundColor: '#e0e0e0',
      borderColor: 'transparent',
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: '#e0e0e0',
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
    '&.Mui-focusVisible': {
      outline: 'none',
    },
  };

  return (
    <div style={{ display: 'flex' }}>
      <Title>Assign to</Title>
      <AssignMemberContainer>
        {assignedToUsers &&
          assignedToUsers.slice(0, 4).map((user) => (
            <AssigneeContainer>
              <UserAvatar user={user} />
              <AssigneeTitle>{displayName(user.userName)}</AssigneeTitle>
              {YouBadge(user)}
            </AssigneeContainer>
          ))}
        {assignedToUsers?.length >= 1 && (
          <div style={{ padding: '4px' }}>
            <MemberGroup members={assignedToUsers.slice(4)} size={32} />
          </div>
        )}
        <div style={{marginLeft:'-2px'}}>
          <Button
            size="small"
            placeholder="Add Assignee"
            variant="outlined"
            disabled={disabled}
            sx={ButtonSx}
            onClick={() => {
              handleClick();
            }}
          >
            <AssignMemberIcon />
            {!isPopoverOpen && assignedToUsers?.length === 0 && (
              <HelperText>Add Assignee</HelperText>
            )}
            {isPopoverOpen && (
              <TextField
                autoFocus
                inputRef={() => inputRef}
                variant="outlined"
                disabled={disabled}
                // placeholder="Add Assignee"
                size="small"
                sx={{
                  backgroundColor: '#f8f8f9',
                  '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  },
                  width: '200px',
                }}
                inputProps={{
                  autoComplete: 'off',
                  value: searchValue,
                  onChange: handleInputChange,
                  onClick: handleClick,
                }}
              />
            )}
          </Button>
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
      </AssignMemberContainer>
    </div>
  );
};

export default AssignedToSection;
