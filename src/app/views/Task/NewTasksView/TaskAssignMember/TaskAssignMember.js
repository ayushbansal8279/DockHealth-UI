import React, { useRef, useState } from 'react';
import Member from 'components/members/Member';
import MagnifierIcon from 'img/magnifier';
import {
  AssignToMeBox,
  StyledPopover,
  Input,
  InputBox,
  Box,
  MembersBox,
  MembersList,
  MemberRow,
} from './styled';

const TaskAssignMember = ({
  children,
  members,
  currentUser,
  task,
  reassignTask,
  isCompletedGroup,
}) => {
  const assignMemberButtonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { taskIdentifier, taskList } = task;
  const { taskListIdentifier } = taskList;

  const membersWithoutCurrentUser = members?.filter(
    ({ userId }) => userId !== currentUser.userId,
  );
  const filteredMembers = membersWithoutCurrentUser?.filter(({ userName }) =>
    userName.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <>
      <div
        onClick={() => {
          if (!isCompletedGroup) openPopover(true);
        }}
        ref={assignMemberButtonReference}
      >
        {children}
      </div>
      <StyledPopover
        anchorEl={assignMemberButtonReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <InputBox>
          <img src={MagnifierIcon} alt="magnifier" />
          <Input onChange={event => setSearchValue(event.target.value)} />
        </InputBox>
        <Box>
          <AssignToMeBox>
            <MemberRow
              onClick={() => {
                reassignTask(
                  taskIdentifier,
                  currentUser.userId,
                  taskListIdentifier,
                );
                openPopover(false);
              }}
            >
              <Member member={currentUser} size={30} />
              <span>Assign To Me</span>
            </MemberRow>
          </AssignToMeBox>
          <MembersBox>
            <MembersList>
              {filteredMembers?.map(member => (
                <MemberRow
                  onClick={() => {
                    reassignTask(
                      taskIdentifier,
                      member.userId,
                      taskListIdentifier,
                    );
                    openPopover(false);
                  }}
                >
                  <Member member={member} size={30} />
                  <span>{member.userName}</span>
                </MemberRow>
              ))}
            </MembersList>
          </MembersBox>
        </Box>
      </StyledPopover>
    </>
  );
};
export default TaskAssignMember;
