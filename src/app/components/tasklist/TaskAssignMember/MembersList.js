import React, { useState, useRef, useEffect } from 'react';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import * as TaskListApi from 'api/tasklist-api';
import Member from 'components/members/Member/Member';
import MagnifierIcon from 'img/magnifier';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';

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

const MembersList = ({ reassignTask, task, currentUser }) => {
  const listId = task?.taskList?.taskListIdentifier;
  const [members, setMembers] = useState(null);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);
  const membersWithoutCurrentUser = members?.filter(
    ({ userId }) => userId !== currentUser?.userId,
  );
  const [searchValue, setSearchValue] = useState('');
  const filteredMembers = membersWithoutCurrentUser?.filter(({ userName }) =>
    userName.toLowerCase().startsWith(searchValue.toLowerCase()),
  );
  const inputReference = useRef(null);

  useEffect(() => {
    if (inputReference) {
      // eslint-disable-next-line no-unused-expressions
      inputReference?.current?.focus();
    }
  }, [inputReference]);

  useEffect(() => {
    setIsFetchingMembers(true);
    TaskListApi.getMembersByTaskListId(listId, 'ALL')
      .then(data => {
        setMembers(data);
        setIsFetchingMembers(false);
      })
      .catch(error => {
        setIsFetchingMembers(false);
        throw error;
      });
  }, [listId]);

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input
          onChange={event => setSearchValue(event.target.value)}
          ref={inputReference}
        />
      </InputBox>
      <Box>
        {currentUser?.userName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) && (
          <AssignToMeBox>
            <MemberRow
              onClick={event => {
                event.stopPropagation();
                reassignTask(task, currentUser);
              }}
            >
              <Member member={currentUser} size={30} />
              <span>Assign To Me</span>
            </MemberRow>
          </AssignToMeBox>
        )}
        {!isFetchingMembers ? (
          <MembersBox>
            <StyledMembersList>
              {'unassigned'.includes(searchValue.toLowerCase()) && (
                <MemberRow
                  key="unassigned"
                  onClick={event => {
                    event.stopPropagation();
                    reassignTask(task, {});
                  }}
                >
                  <RemoveCircleOutlineRounded
                    color="action"
                    style={{ height: '30px', width: '30px' }}
                  />
                  <span>Unassigned</span>
                </MemberRow>
              )}
              {filteredMembers?.map(member => (
                <MemberRow
                  key={member?.userId}
                  onClick={event => {
                    event.stopPropagation();
                    reassignTask(task, member);
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
            <Loader size={LoaderSizes.medium} />
          </LoaderContainer>
        )}
      </Box>
    </>
  );
};

export default MembersList;
