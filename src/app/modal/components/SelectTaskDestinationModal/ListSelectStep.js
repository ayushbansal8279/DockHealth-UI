import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  addTaskList,
  getSharedTaskListsWithCurrentUser,
} from 'api/tasklist-api';
import { getTaskListForUser } from 'actions/tasklist-actions';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import {
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  QuickAddInput,
  QuickAddInputWrapper,
  ListItemTextButton,
  NextArrow,
  Step,
} from './styled';

const ListSelectStep = ({
  currentTaskListIdentifier,
  selectedList,
  setSelectedList,
  nextStep,
  closeModal,
}) => {
  const dispatch = useDispatch();
  const addListReference = useRef(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [savingList, setSavingList] = useState(false);
  const [
    listInputFocused,
    setListInputFocused,
    unsetListInputFocused,
  ] = useBoolean(false);

  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    if (currentUser?.userIdentifier) {
      getSharedTaskListsWithCurrentUser(currentUser.userIdentifier)
        .then(responseLists => {
          setLists(
            responseLists.filter(
              ({ taskListIdentifier }) =>
                taskListIdentifier !== currentTaskListIdentifier,
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

  const handleAddNewList = listName => {
    if (savingList) return;

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

  return (
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
                    selectedList?.taskListIdentifier === list.taskListIdentifier
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
                      nextStep();
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
              disabled={savingList}
              onKeyDown={event =>
                event.key === 'Enter' && handleAddNewList(event.target.value)
              }
            />
          </QuickAddInputWrapper>
        </>
      </ViewLoader>
    </Step>
  );
};

export default ListSelectStep;
