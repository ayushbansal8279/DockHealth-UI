import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Spacing from 'components/common/Spacing.tsx';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  Title,
  Description,
  ListsWrapper,
  ListItem,
  EmptyMessage,
  AddListInputWrapper,
  AddListInput,
} from './styled';

const ListSelectSection = ({
  lists,
  selectedList,
  isFetchingLists,
  onListSelection,
  onAddList,
}) => {
  const addListInput = useRef();
  const [isInputFoucused, setInputFocused] = useState(false);

  const { orgUserRole } = useSelector(userProfileSelector);
  const isGuest = orgUserRole === 'GUEST';

  const handleAddNewList = listName => {
    if (listName) {
      onAddList(listName);
      addListInput.current.value = '';
    }
  };

  return (
    <>
      <Title>Select list</Title>
      <Description>Choose a list for your task</Description>
      <Spacing vertical={4} />
      <ListsWrapper>
        {!isFetchingLists && (
          <>
            {lists?.length > 0 ? (
              lists.map(list => (
                <ListItem
                  key={list.taskListIdentifier}
                  isSelected={
                    selectedList &&
                    selectedList.taskListIdentifier === list.taskListIdentifier
                  }
                  onClick={() => onListSelection(list)}
                  type="button"
                >
                  {list.listName}
                </ListItem>
              ))
            ) : (
              <EmptyMessage>List is empty</EmptyMessage>
            )}
          </>
        )}
      </ListsWrapper>
      {!isGuest && (
        <AddListInputWrapper isFocused={isInputFoucused}>
          <AddListInput
            ref={addListInput}
            type="text"
            placeholder="Add list"
            onFocus={() => {
              onListSelection(null);
              setInputFocused(true);
            }}
            onBlur={() => setInputFocused(false)}
            onKeyDown={event =>
              event.keyCode === 13 && handleAddNewList(event.target.value)
            }
          />
        </AddListInputWrapper>
      )}
    </>
  );
};

export default ListSelectSection;
