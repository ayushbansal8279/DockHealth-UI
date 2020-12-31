import React, { useState, useEffect, useRef } from 'react';
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
import { getGroupsForTaskList } from 'api/task-group-list-api';
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
  ListItemText,
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
  const [selectedList, setSelectedList] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [isFetchingGroups, setIsFetchingGroups] = useState(true);
  const [groups, setGroups] = useState(null);
  const [isSavingList, setSavingList] = useState(false);
  const [inputFocused, setInputFocused, unsetInputFocused] = useBoolean(false);

  const [stepIndex, setStepIndex] = useState(0);

  const currentUser = useSelector(userProfileSelector);

  const dispatch = useDispatch();

  // const handleListSelectSave = taskListIdentifier => {
  //   if (isSavingList || !taskListIdentifier) {
  //     return;
  //   }
  //   confirm(taskListIdentifier);
  //   closeModal();
  // };

  const handleAddNewList = listName => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      memberIdentifiers: [currentUser.userIdentifier],
      listName,
    })
      .then(createdLists => {
        setSavingList(false);
        // handleListSelectSave(taskListIdentifier);
        setLists(previousLists => setLists([...previousLists, createdLists]));
        dispatch(getTaskListForUser());
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
                        onClick={() => setSelectedList(list)}
                        type="button"
                        isSelected={
                          selectedList?.taskListIdentifier ===
                          list.taskListIdentifier
                        }
                      >
                        <ListItemText>{list.listName}</ListItemText>
                        <IconButton onClick={() => setStepIndex(1)}>
                          <NextArrow />
                        </IconButton>
                      </ListItem>
                    ))
                  ) : (
                    <EmptyMessage>List is empty</EmptyMessage>
                  )}
                </ListsWrapper>
                <QuickAddInputWrapper isFocused={inputFocused}>
                  <QuickAddInput
                    ref={addListReference}
                    type="text"
                    placeholder="Add list"
                    onFocus={setInputFocused}
                    onBlur={unsetInputFocused}
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
                    }}
                  >
                    <ArrowBackIcon />
                  </button>
                  <Title>{selectedList.listName}</Title>
                </TitleWithButtonWrapper>
                <Box m={1} />
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
          <Button fullWidth size="small" onClick={() => setStepIndex(1)}>
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectTaskDestinationModal;
