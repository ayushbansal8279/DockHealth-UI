import React, { useRef, useState } from 'react';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import {
  Title,
  Description,
  ListsWrapper,
  ListItem,
  EmptyMessage,
  StyledButton,
  AddListInputWrapper,
  AddListInput,
} from './styled';

const ListSelectSection = ({
  lists,
  selectedList,
  isFetchingLists,
  onListSelection,
  onAddList,
  onSave,
  onCancel,
}) => {
  const addListInput = useRef();
  const [isInputFoucused, setInputFocused] = useState(false);

  const handleAddNewList = listName => {
    if (listName) {
      onAddList(listName);
      addListInput.current.value = '';
    }
  };

  const handleSaveClick = () => {
    if (addListInput?.current?.value)
      handleAddNewList(addListInput?.current?.value);
    else onSave(selectedList?.taskListIdentifier);
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
      <Spacing vertical={4} />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <StyledButton
            variant="outlined"
            type="button"
            size="small"
            onClick={onCancel}
          >
            Cancel
          </StyledButton>
        </Grid>
        <Grid item xs={6}>
          <StyledButton
            variant="contained"
            type="button"
            size="small"
            onClick={() => handleSaveClick()}
          >
            Save
          </StyledButton>
        </Grid>
      </Grid>
    </>
  );
};

export default ListSelectSection;
