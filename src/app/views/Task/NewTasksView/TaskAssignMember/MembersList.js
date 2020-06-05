import React, { useState } from 'react';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import Member from 'components/members/Member';
import MagnifierIcon from 'img/magnifier';
import Loader from 'components/common/Loader/Loader';

import {
  AssignToMeBox,
  Input,
  InputBox,
  Box,
  MembersBox,
  StyledMembersList,
  MemberRow,
  LoaderContainer,
} from './styled';

const MembersList = ({
  reassignTask,
  task,
  members,
  currentUser,
  isFetchingMembers = false,
}) => {
  const { taskIdentifier } = task;

  const membersWithoutCurrentUser = members?.filter(
    ({ userId }) => userId !== currentUser.userId,
  );
  const [searchValue, setSearchValue] = useState('');
  const filteredMembers = membersWithoutCurrentUser?.filter(({ userName }) =>
    userName.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input onChange={event => setSearchValue(event.target.value)} />
      </InputBox>
      <Box>
        <AssignToMeBox>
          <MemberRow
            onClick={() => {
              reassignTask(taskIdentifier, currentUser.userId);
            }}
          >
            <Member member={currentUser} size={30} />
            <span>Assign To Me</span>
          </MemberRow>
        </AssignToMeBox>
        {!isFetchingMembers ? (
          <MembersBox>
            <StyledMembersList>
              <MemberRow
                key="unassigned"
                onClick={() => {
                  reassignTask(taskIdentifier, null);
                }}
              >
                <RemoveCircleOutlineRounded
                  color="action"
                  style={{ height: '30px', width: '30px' }}
                />
                <span>Unassigned</span>
              </MemberRow>
              {filteredMembers?.map(member => (
                <MemberRow
                  key={member.userId}
                  onClick={() => {
                    reassignTask(taskIdentifier, member.userId);
                  }}
                >
                  <Member member={member} size={30} />
                  <span>{member.userName}</span>
                </MemberRow>
              ))}
            </StyledMembersList>
          </MembersBox>
        ) : (
          <LoaderContainer>
            <Loader size={16} />
          </LoaderContainer>
        )}
      </Box>
    </>
  );
};

export default MembersList;
