import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import useBoolean from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import { getTaskListForUser } from 'actions/tasklist-actions';
import {
  addTaskList,
  getSharedTaskListsWithCurrentUser,
} from 'api/tasklist-api';
import {
  getGroupsForTaskList,
  createGroupAssignedToList,
} from 'api/task-group-list-api';
import Button from 'components/common/Button/Button';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import {
  Container,
  TitleWithButtonWrapper,
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  QuickAddInput,
  QuickAddInputWrapper,
  ListItemTextButton,
  NextArrow,
  StepsContainer,
  Step,
} from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';

const SelectTaskDestinationModal = ({ closeModal, confirm, task }) => {
  const addListReference = useRef(null);
  const addGroupReference = useRef(null);
  const [selectedList, setSelectedList] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isFetchingGroups, setIsFetchingGroups] = useState(true);
  const [groups, setGroups] = useState(null);
  const [isSavingList, setSavingList] = useState(false);
  const [
    listInputFocused,
    setListInputFocused,
    unsetListInputFocused,
  ] = useBoolean(false);
  const [
    groupInputFocused,
    setGroupInputFocused,
    unsetGroupInputFocused,
  ] = useBoolean(false);

  const [stepIndex, setStepIndex] = useState(0);

  const currentUser = useSelector(userProfileSelector);

  const dispatch = useDispatch();

  const handleAddNewList = listName => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      memberIdentifiers: [currentUser.userIdentifier],
      listName,
    })
      .then(createdLists => {
        setSavingList(false);
        setLists(previousLists => setLists([...previousLists, createdLists]));
        addListReference.current.value = '';
        dispatch(getTaskListForUser());
      })
      .catch(() => {
        setSavingList(false);
      });
  };

  const handleAddNewGroup = groupName => {
    if (isSavingList || !selectedList) return;

    setSavingList(true);
    createGroupAssignedToList({
      taskListIdentifier: selectedList?.taskListIdentifier,
      groupName,
    })
      .then(createdGroup => {
        setSavingList(false);
        setGroups(previousGroups =>
          setGroups([...previousGroups, createdGroup]),
        );
        addGroupReference.current.value = '';
      })
      .catch(() => {
        setSavingList(false);
      });
  };

  useEffect(() => {
    if (currentUser?.userIdentifier) {
      getSharedTaskListsWithCurrentUser(currentUser.userIdentifier)
        .then(responseLists => {
          setLists(
            responseLists.filter(
              ({ taskListIdentifier }) =>
                taskListIdentifier !== task?.taskList?.taskListIdentifier,
            ),
          );
          setIsFetchingLists(false);
        })
        .catch(() => {
          closeModal();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (selectedList?.taskListIdentifier && selectedList.listType !== 'INBOX') {
      setIsFetchingGroups(true);
      getGroupsForTaskList(selectedList.taskListIdentifier)
        .then(responseGroups => {
          setGroups(responseGroups);
          setIsFetchingGroups(false);
        })
        .catch(() => {
          setIsFetchingGroups(false);
        });
    }
  }, [selectedList]);

  const handleConfirm = useCallback(() => {
    if (!selectedList) return;

    const responseData = {
      taskListIdentifier: selectedList?.taskListIdentifier,
    };
    if (selectedGroup) {
      responseData.taskGroupIdentifier = selectedGroup.taskGroupIdentifier;
    }
    if (typeof confirm === 'function') {
      confirm(responseData);
      closeModal();
    } else {
      console.warn('You have to provide confirm callback');
    }
  }, [confirm, selectedGroup, selectedList, closeModal]);

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <StepsContainer stepIndex={stepIndex}>
          <Step>
            <Title>Lists</Title>
            <Box m={1} />
            <ViewLoader isFetchingData={isFetchingLists}>
              <>
                <ListsWrapper>
                  {lists?.length > 0 ? (
                    lists.map(list => (
                      <ListItem
                        key={list.taskListIdentifier}
                        isSelected={
                          selectedList?.taskListIdentifier ===
                          list.taskListIdentifier
                        }
                      >
                        <ListItemTextButton
                          onClick={() => setSelectedList(list)}
                          type="button"
                          isSelected={
                            selectedList?.taskListIdentifier ===
                            list.taskListIdentifier
                          }
                        >
                          {list.listName}
                        </ListItemTextButton>
                        <IconButton
                          onClick={() => {
                            setSelectedList(list);
                            setStepIndex(1);
                          }}
                        >
                          <NextArrow />
                        </IconButton>
                      </ListItem>
                    ))
                  ) : (
                    <EmptyMessage>List is empty</EmptyMessage>
                  )}
                </ListsWrapper>
                <QuickAddInputWrapper isFocused={listInputFocused}>
                  <QuickAddInput
                    ref={addListReference}
                    type="text"
                    placeholder="Add list"
                    onFocus={setListInputFocused}
                    onBlur={unsetListInputFocused}
                    disabled={isSavingList}
                    onKeyDown={event =>
                      event.key === 'Enter' &&
                      handleAddNewList(event.target.value)
                    }
                  />
                </QuickAddInputWrapper>
              </>
            </ViewLoader>
          </Step>
          <Step>
            {selectedList && (
              <>
                <TitleWithButtonWrapper>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIndex(0);
                      setSelectedList(null);
                      setSelectedGroup(null);
                    }}
                  >
                    <ArrowBackIcon />
                  </button>
                  <Title>{selectedList.listName}</Title>
                </TitleWithButtonWrapper>
                <Box m={1} />
                <ViewLoader isFetchingData={isFetchingGroups}>
                  <>
                    <ListsWrapper>
                      {groups?.length > 0 ? (
                        groups.map(group => (
                          <ListItem
                            key={group.groupIdentifier}
                            isSelected={
                              selectedGroup?.taskGroupIdentifier ===
                              group.taskGroupIdentifier
                            }
                          >
                            <ListItemTextButton
                              onClick={() => setSelectedGroup(group)}
                              type="button"
                              isSelected={
                                selectedGroup?.taskGroupIdentifier ===
                                group.taskGroupIdentifier
                              }
                            >
                              {group.groupName === 'DEFAULT'
                                ? 'New tasks'
                                : group.groupName}
                            </ListItemTextButton>
                          </ListItem>
                        ))
                      ) : (
                        <EmptyMessage>List is empty</EmptyMessage>
                      )}
                    </ListsWrapper>
                    <QuickAddInputWrapper isFocused={groupInputFocused}>
                      <QuickAddInput
                        ref={addGroupReference}
                        type="text"
                        placeholder="Add group"
                        onFocus={setGroupInputFocused}
                        onBlur={unsetGroupInputFocused}
                        disabled={isSavingList}
                        onKeyDown={event =>
                          event.key === 'Enter' &&
                          handleAddNewGroup(event.target.value)
                        }
                      />
                    </QuickAddInputWrapper>
                  </>
                </ViewLoader>
              </>
            )}
          </Step>
        </StepsContainer>
      </Container>
      <Box m={2} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </FlexButtonWrapper>
        <Box m={1} />
        <FlexButtonWrapper>
          <Button
            fullWidth
            size="small"
            disabled={!selectedList}
            onClick={handleConfirm}
          >
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectTaskDestinationModal;
