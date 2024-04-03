/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import pluck from 'ramda/src/pluck';
import trim from 'ramda/src/trim';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import palette from '@/app/styles/palette';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { AdornmentClear } from '../styled';
import {
  AssignMemberContainer,
  Title,
  AssigneeContainer,
  AssigneeTitle,
  StyledYouBadge,
  PopupContainer,
  HelperText,
} from './styled';
import UserAvatar from '../../user/UserAvatar/UserAvatar';
import MemberGroup from '../../user/MemberGroup/MemberGroup';
import { Button, TextField } from '@mui/material';
import AssignMemberIcon from '../../user/AssignMemberIcon/AssingMemberIcon';

const AssignedToSection = ({ disabled }) => {
  const currentUser = useSelector(userProfileSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const { assignedToUsers, taskList, taskListIdentifier } =
    selectedWorkflow || {};
  const [assignedToUsersValue, setAssignedToUsersValue] = useState();
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [isPopoverOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

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

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
  };

  const handleClick = () => {
    setIsOpen(true);
    inputRef.current.focus();
  };

  const displayName = (userName) => {
    return userName.length > 20 ? `${userName.slice(0, 20)} ...` : userName;
  };

  const YouBadge = (user) => {
    if (user.identifier === currentUser.identifier)
      return <StyledYouBadge>You</StyledYouBadge>;
  };

  const ButtonSx = {
    height: '40px',
    borderRadius: '4px',
    borderColor: 'transparent',
    backgroundColor: isPopoverOpen ? palette.whiteSmoke : 'transparent',
    '&:hover': {
      backgroundColor: palette.whiteSmoke,
      borderColor: 'transparent',
    },
    '&:active': {
      backgroundColor: palette.whiteSmoke,
      borderColor: 'transparent',
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: palette.whiteSmoke,
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
    '&.Mui-focusVisible': {
      outline: 'none',
    },
  };

  return (
    <div style={{ display: 'flex', marginLeft: '10px' }}>
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

        <div>
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
                  backgroundColor: palette.whiteSmoke,
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
              />
            </PopupContainer>
          )}
        </div>
      </AssignMemberContainer>
    </div>
  );
};

export default AssignedToSection;
