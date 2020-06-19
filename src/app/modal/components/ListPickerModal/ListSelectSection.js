import React, { useRef } from 'react';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
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

  const handleInputEnterDown = listName => {
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
        <ViewLoader isFetchingData={isFetchingLists}>
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
        </ViewLoader>
      </ListsWrapper>
      <AddListInputWrapper>
        <AddListInput
          ref={addListInput}
          type="text"
          placeholder="Add list"
          onKeyDown={event =>
            event.keyCode === 13 && handleInputEnterDown(event.target.value)
          }
          onFocus={() => onListSelection(null)}
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
            onClick={() =>
              selectedList && onSave(selectedList.taskListIdentifier)
            }
          >
            Save
          </StyledButton>
        </Grid>
      </Grid>
    </>
  );
};

export default ListSelectSection;
