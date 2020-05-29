import React, { useState } from 'react';
import Member from 'components/members/Member';
import MagnifierIcon from 'img/magnifier';
import CubesLoader from 'components/common/CubesLoader';

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
            <CubesLoader size={16} />
          </LoaderContainer>
        )}
      </Box>
    </>
  );
};

export default MembersList;
