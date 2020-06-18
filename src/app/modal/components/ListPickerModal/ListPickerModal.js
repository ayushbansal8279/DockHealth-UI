import React, { useState, useEffect } from 'react';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import {
  CloseIconButton,
  CloseIcon,
  Title,
  Description,
  ListsWrapper,
  ListItem,
  EmptyMessage,
  StyledButton,
} from './styled';
import { ModalWrapper } from '../styled';

const ListPickerModal = ({ closeModal, confirm, fetchMethod }) => {
  const [selectedList, setSelectedList] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);

  const handleSave = () => {
    if (!selectedList) return;

    confirm(selectedList);
  };

  useEffect(() => {
    fetchMethod()
      .then(data => {
        setLists(data);
        setIsFetchingLists(false);
      })
      .catch(() => {
        closeModal();
      });
  }, [closeModal, fetchMethod]);

  return (
    <ModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
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
                onClick={() => setSelectedList(list)}
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
      <Spacing vertical={4} />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <StyledButton
            variant="outlined"
            type="button"
            size="small"
            onClick={closeModal}
          >
            Cancel
          </StyledButton>
        </Grid>
        <Grid item xs={6}>
          <StyledButton
            variant="contained"
            type="button"
            size="small"
            onClick={handleSave}
          >
            Save
          </StyledButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default ListPickerModal;
