import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
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
import { useIsWorkspaceScopedPatient } from '@/app/hooks/useIsWorkspaceScopedPatient';

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
  enableSelectingGroupStep,
  renderDescription
}) => {
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [listInputFocused, setListInputFocused, unsetListInputFocused] =
    useBoolean(false);

  const currentUser = useSelector(userProfileSelector);
  const addListInputReference = addListInput;

  const isAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'list.add.adminonly.enabled',
    ) || {};
  const listAddAdminOnly = quickAddPatientEnabledItem?.value === 'true';
  const { workspaceIdentifier } = useIsWorkspaceScopedPatient();

  useEffect(() => {
    if (currentUser?.userIdentifier) {
      getSharedTaskListsWithCurrentUser(currentUser.userIdentifier, workspaceIdentifier)
        .then((responseLists) => {
          setLists(responseLists);
          setIsFetchingLists(false);
        })
        .catch(() => {
          closeModal();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleAddNewList = (listName) => {
    if (listName) {
      onAddList(listName);
      addListInputReference.current.value = '';
    }
  };

  return (
    <Step>
      <Title>Select List</Title>
      <Box m={1} />
      {renderDescription?.()}
      <ListsWrapper>
        {!isFetchingLists && (
          <>
            {lists?.length > 0 ? (
              lists.map((list) => (
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
                    {list.discoveryEnabled === true
                      ? `${list.listName} (Shared)`
                      : list.listName}
                  </ListItemTextButton>
                  {enableSelectingGroupStep && (
                    <IconButton
                      onClick={() => {
                        setSelectedList(list);
                        setNextStep();
                      }}
                    >
                      <NextArrow />
                    </IconButton>
                  )}
                </ListItem>
              ))
            ) : (
              <EmptyMessage>List is empty</EmptyMessage>
            )}
          </>
        )}
      </ListsWrapper>
      {(!listAddAdminOnly || (listAddAdminOnly && isAdmin)) && (
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
            disabled={savingList || isFetchingLists}
            onKeyDown={(event) =>
              event.key === 'Enter' && handleAddNewList(event.target.value)
            }
          />
        </QuickAddInputWrapper>
      )}
    </Step>
  );
};

export default ListSelectStep;
