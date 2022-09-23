import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'react-use';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { getUserGroupDetailsSelector } from 'selectors/user-groups-selectors';
import { getOrgRole } from 'helpers/user-helper';
import append from 'ramda/src/append';
import differenceWith from 'ramda/src/differenceWith';
import eqProps from 'ramda/src/eqProps';
import pluck from 'ramda/src/pluck';
import { openModal } from 'modal/actions';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import Input from 'components/common/Input/Input';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { DefaultUserGroup } from 'helpers/user-groups-helper';
import {
  getUserGroupDetails,
  updateUsersInGroup,
} from 'actions/user-groups-actions';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientModalWrapper,
  MainContentWrapper,
  Header,
  ListInfo,
  ListName,
  ListDescription,
  PatientsSection,
  Column,
  SelectedUsersWrapper,
  SelectedUserRow,
  SelectedUserCell,
  EmptyListText,
  DeleteIcon,
  OptionRow,
  OptionCell,
  optionHighlightStyle,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddUserToGroupModal = ({ closeModal, userGroupIdentifier }) => {
  const [inputValue, setInputValue] = useState(false);
  const [hasUnsavedChanges, setUnsavedChanges] = useState(false);
  const dispatch = useDispatch();

  const userGroupDetails = useSelector(
    getUserGroupDetailsSelector(userGroupIdentifier),
  );
  const { name, description, isFetching, users: groupUsers, isSaving, error } =
    userGroupDetails || {};

  const { isFetching: isFetchingAllUsers, users: allUsersInOrganization } =
    useSelector(getUserGroupDetailsSelector(DefaultUserGroup.ALL)) || {};

  const [selectedUsers, setSelectedUsers] = useState([]);

  const previousIsSaving = usePrevious(isSaving);
  useEffect(() => {
    if (!isSaving && previousIsSaving === true && !error) {
      closeModal();
    }
  }, [closeModal, error, isSaving, previousIsSaving]);

  useEffect(() => {
    dispatch(getUserGroupDetails(userGroupIdentifier));
  }, [dispatch, userGroupIdentifier]);

  useEffect(() => {
    setSelectedUsers(groupUsers);
    setUnsavedChanges(false);
  }, [groupUsers]);

  const handleEditList = () => {
    dispatch(openModal('EditUserGroup', { userGroup: userGroupDetails }));
  };

  const handleSelectUser = useCallback((_, user) => {
    setSelectedUsers(append(user));
    setUnsavedChanges(true);
  }, []);

  const deleteSelectedUser = identifier => {
    setSelectedUsers(previousSelectedUsers =>
      previousSelectedUsers.filter(
        ({ userIdentifier }) => userIdentifier !== identifier,
      ),
    );
    setUnsavedChanges(true);
  };

  const handleSaveClick = () => {
    dispatch(
      updateUsersInGroup(
        userGroupIdentifier,
        pluck('userIdentifier', selectedUsers),
      ),
    );
  };

  const availableUsers = useMemo(
    () =>
      allUsersInOrganization && selectedUsers
        ? differenceWith(
            eqProps('identifier'),
            allUsersInOrganization,
            selectedUsers,
          )
        : [],
    [allUsersInOrganization, selectedUsers],
  );

  return (
    <AddPatientModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <MainContentWrapper>
        <Header>User group builder</Header>
        <Spacing vertical={5} />
        <Grid container alignItems="center">
          <GroupAvatar group={userGroupDetails} size={54} hideTooltip />
          <Spacing horizontal={4} />
          <ListInfo>
            <ListName>{name}</ListName>
            {description && (
              <ListDescription>
                {description.length > 245
                  ? `${description.slice(245)}...`
                  : description}
              </ListDescription>
            )}
          </ListInfo>
          <Spacing horizontal={4} />
          <Button
            width="100px"
            variant="text"
            onClick={handleEditList}
            size="small"
          >
            Edit
          </Button>
        </Grid>
        <Spacing vertical={5} />
        <PatientsSection>
          <Column width={320}>
            <Header>Add users</Header>
            <Spacing vertical={4} />
            <Autocomplete
              inputValue={inputValue}
              autoHighlight
              options={availableUsers}
              loading={isFetchingAllUsers}
              getOptionLabel={user => `${user.name} ${user.email}`}
              renderOption={(option, { inputValue: searchValue }) => (
                <OptionRow>
                  <OptionCell>
                    <Highlighter
                      highlightStyle={optionHighlightStyle}
                      searchWords={searchValue?.toLowerCase().split(/\s+/)}
                      autoEscape
                      textToHighlight={option.name ?? '-'}
                    />
                  </OptionCell>
                  <OptionCell>
                    <Highlighter
                      highlightStyle={optionHighlightStyle}
                      searchWords={searchValue?.toLowerCase().split(/\s+/)}
                      autoEscape
                      textToHighlight={option.email ?? '-'}
                    />
                  </OptionCell>
                </OptionRow>
              )}
              onInputChange={event => setInputValue(event?.target?.value || '')}
              onChange={handleSelectUser}
              onOpen={() => dispatch(getUserGroupDetails(DefaultUserGroup.ALL))}
              clearOnBlur={false}
              disableClearable
              forcePopupIcon={false}
              noOptionsText="No users found"
              renderInput={({ ...props }) => (
                <Input label="User lookup" name="userLookup" {...props} />
              )}
            />
          </Column>
          <Spacing horizontal={4} />
          <Column>
            <Header>Included users in the group</Header>
            <Spacing vertical={4} />
            <SelectedUsersWrapper>
              {!isFetching ? (
                <>
                  {selectedUsers?.length > 0 ? (
                    selectedUsers.map(
                      ({
                        userIdentifier,
                        lastName,
                        firstName,
                        email,
                        orgUserRole,
                      }) => (
                        <SelectedUserRow key={userIdentifier}>
                          <SelectedUserCell>
                            {lastName || '-'}, {firstName || '-'}
                          </SelectedUserCell>
                          <SelectedUserCell>{email || '-'}</SelectedUserCell>
                          <SelectedUserCell>
                            {getOrgRole(orgUserRole)}
                          </SelectedUserCell>
                          <SelectedUserCell>
                            <button
                              type="button"
                              onClick={() => deleteSelectedUser(userIdentifier)}
                            >
                              <DeleteIcon />
                            </button>
                          </SelectedUserCell>
                        </SelectedUserRow>
                      ),
                    )
                  ) : (
                    <EmptyListText>List is empty</EmptyListText>
                  )}
                </>
              ) : null}
            </SelectedUsersWrapper>
          </Column>
        </PatientsSection>
      </MainContentWrapper>
      <Spacing vertical={4} />
      <Grid container direction="row" justify="flex-end">
        <Button
          variant="secondary"
          width="150px"
          onClick={closeModal}
          size="small"
        >
          Cancel
        </Button>
        <Spacing horizontal={4} />
        <Button
          width="200px"
          disabled={isSaving || !hasUnsavedChanges}
          onClick={handleSaveClick}
          size="small"
        >
          Save user group
        </Button>
      </Grid>
    </AddPatientModalWrapper>
  );
};

export default AddUserToGroupModal;
