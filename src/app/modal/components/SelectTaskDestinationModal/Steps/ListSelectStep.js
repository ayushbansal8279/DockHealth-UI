import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
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
} from '../styled';

const ListSelectStep = ({
  selectedList,
  setSelectedList,
  setNextStep,
  closeModal,
  addListInput,
  lists,
  setLists,
  onAddList,
  savingList,
}) => {
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [
    listInputFocused,
    setListInputFocused,
    unsetListInputFocused,
  ] = useBoolean(false);

  const currentUser = useSelector(userProfileSelector);
  const addListInputReference = addListInput;

  useEffect(() => {
    if (currentUser?.userIdentifier) {
      getSharedTaskListsWithCurrentUser(currentUser.userIdentifier)
        .then(responseLists => {
          setLists(responseLists);
          setIsFetchingLists(false);
        })
        .catch(() => {
          closeModal();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleAddNewList = listName => {
    if (listName) {
      onAddList(listName);
      addListInputReference.current.value = '';
    }
  };

  return (
    <Step>
      <Title>LISTS</Title>
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
                      setNextStep();
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
              ref={addListInputReference}
              type="text"
              placeholder="Add list"
              onFocus={setListInputFocused}
              onBlur={unsetListInputFocused}
              onChange={() => {
                if (addListInputReference?.current?.value) {
                  setSelectedList({
                    listName: addListInputReference?.current?.value,
                  });
                } else {
                  setSelectedList(null);
                }
              }}
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
