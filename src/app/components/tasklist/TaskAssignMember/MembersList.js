import React, { useState, useRef, useEffect } from 'react';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import * as TaskListApi from 'api/task-list-api';
import Member from 'components/members/Member/Member';
import MagnifierIcon from 'img/magnifier';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import { pipe, sortBy, prop, uniqBy, innerJoin } from 'ramda';

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

const convert = pipe(sortBy(prop('userName')), uniqBy(prop('userIdentifier')));

async function collectedAllListMembers(taskListIdentifiers, setMembers) {
  let listMemembers = [];
  await taskListIdentifiers.map(async tlIdentifier => {
    const data = await TaskListApi.getMembersByTaskListId(tlIdentifier, 'ALL');
    if (listMemembers.length === 0) {
      listMemembers = listMemembers.concat(data);
    } else {
      listMemembers = innerJoin(
        (existingRecord, newRecord) =>
          existingRecord.userIdentifier === newRecord.userIdentifier,
        listMemembers,
        data,
      );
    }
    listMemembers = convert(listMemembers);
    setMembers(listMemembers);
  });
  return listMemembers;
}

const MembersList = ({
  reassignTask,
  task,
  currentUser,
  taskListIdentifier,
  selectedTaskListIdentifiers,
}) => {
  const listId = taskListIdentifier || task?.taskList?.taskListIdentifier;
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
    if (listId) {
      TaskListApi.getMembersByTaskListId(listId, 'ALL')
        .then(data => {
          setMembers(data);
          setIsFetchingMembers(false);
        })
        .catch(error => {
          setIsFetchingMembers(false);
          throw error;
        });
    } else {
      if (selectedTaskListIdentifiers) {
        setMembers([]);
        collectedAllListMembers(selectedTaskListIdentifiers, setMembers);
      }
      setIsFetchingMembers(false);
    }
  }, [listId, selectedTaskListIdentifiers]);

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
