import React, { useEffect, useState, useMemo } from 'react';
import { Box, IconButton } from '@material-ui/core';
// import { useBoolean } from 'hooks/useBoolean';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  userProfileSelector,
  userOrganizationsSelector,
} from 'selectors/user-selectors';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import {
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
//   QuickAddInput,
//   QuickAddInputWrapper,
  ListItemTextButton,
  NextArrow,
  Step,
} from '../styled';


const OrganizationSelectStep = ({
  selectedOrganization,
  setSelectedOrganization,
  setNextStep,
  closeModal,
//   addListInput,
  organizations,
  setOrganizations,
//   onAddList,
//   savingList,
  enableSelectingGroupStep,
}) => {
//   const [
//     listInputFocused,
//     setListInputFocused,
//     unsetListInputFocused,
//   ] = useBoolean(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const userOrganizations = useSelector(userOrganizationsSelector);
  const { orgUserRole } = currentUser;

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const currentOrganization = useMemo(
    () =>
      userOrganizations?.find(
        ({ organizationIdentifier }) =>
          currentOrganizationIdentifier === organizationIdentifier,
      ),
    [userOrganizations, currentOrganizationIdentifier],
  );

  const availableUserOrganizations = useMemo(
    () =>
      userOrganizations?.filter(
        ({ organizationIdentifier }) =>
          organizationIdentifier !== currentOrganizationIdentifier,
      ),
    [userOrganizations, currentOrganizationIdentifier],
  );

//   const addListInputReference = addListInput;

//   useEffect(() => {
//     if (currentUser?.userIdentifier) {
//       getSharedTaskListsWithCurrentUser(currentUser.userIdentifier)
//         .then(responseLists => {
//           setOrganizations(responseLists);
//           setIsFetchingOrganizations(false);
//         })
//         .catch(() => {
//           closeModal();
//         });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentUser]);

//   const handleAddNewList = listName => {
//     if (listName) {
//       onAddList(listName);
//       addListInputReference.current.value = '';
//     }
//   };

  return (
    <Step>
      <Title>Organizations</Title>
      <Box m={1} />
      <ListsWrapper>
        {availableUserOrganizations.length > 0 && (
          <>
            {availableUserOrganizations?.length > 0 ? (
              availableUserOrganizations.map(list => (
                <ListItem
                  key={list.organizationIdentifier}
                  isSelected={
                    currentOrganizationIdentifier ===
                    list.organizationIdentifier
                  }
                >
                  <ListItemTextButton
                    onClick={() => {
                      setSelectedOrganization(list);
                    }}
                    type="button"
                    isSelected={
                      currentOrganizationIdentifier ===
                      list.organizationIdentifier
                    }
                  >
                    {list.organizationName}
                  </ListItemTextButton>
                  {enableSelectingGroupStep && (
                    <IconButton
                      onClick={() => {
                        setSelectedOrganization(list);
                        setNextStep();
                      }}
                    >
                      <NextArrow />
                    </IconButton>
                  )}
                </ListItem>
              ))
            ) : (
              <EmptyMessage>No other organizations</EmptyMessage>
            )}
          </>
        )}
      </ListsWrapper>
      {/* <QuickAddInputWrapper isFocused={listInputFocused}>
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
          onKeyDown={event =>
            event.key === 'Enter' && handleAddNewList(event.target.value)
          }
        />
      </QuickAddInputWrapper> */}
    </Step>
  );
};

export default OrganizationSelectStep;
