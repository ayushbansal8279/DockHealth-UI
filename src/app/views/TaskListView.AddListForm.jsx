import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { isEmpty } from 'ramda';
import React from 'react';
import { saveTaskList } from '../actions/tasklist-actions';
import Spacing from '../components/common/Spacing';
import Member from '../components/members/Member';
import { StyledSwitchUnbound } from '../components/userProfileView/StyledSwitch';
import { showAlert } from '../helpers/utility-functions';
import { MontserratTypography } from '../theme-montserrat';
import {
  EmptyMember,
  EmptyMemberIcon,
  FormContainer,
  FormDivider,
  FormIconContainer,
  FormLabel,
  MemberContainer,
  MembersContainer,
  SearchField,
  SearchFieldContainer,
  SearchFieldIcon,
  StyledButton,
  StyledCollapse,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
  StyledList,
  StyledListItem,
} from './TaskListView.AddListForm.Components';
import initializeAddListFormHooks from './TaskListView.AddListForm.Hooks';

const onSubmit = ({
  dispatch,
  setListFormOpen,
  taskListIdentifier = null,
}) => data => {
  const taskList = { ...data, taskListIdentifier };

  saveTaskList(taskList)(dispatch)
    .then(() => {
      toggleAlert('Task list saved successfully!', 'success');
      setListFormOpen(false);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ?? 'Failed to save task list, please try again later',
      });
    });
};

const renderMember = ({ people, removePerson }) => memberId => {
  return (
    <MemberContainer key={memberId}>
      <Member
        onClick={() => removePerson({ userIdentifier: memberId })}
        member={
          people !== undefined && Array.isArray(people)
            ? people.find(({ userIdentifier }) => userIdentifier === memberId)
            : undefined
        }
      />
    </MemberContainer>
  );
};

const renderPickerOption = ({ closePicker, addPerson }) => member => {
  const { firstName, lastName, userIdentifier } = member;

  const userName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  return (
    <StyledListItem
      button
      onClick={() => {
        addPerson({ userIdentifier });
        closePicker();
      }}
      key={userIdentifier}
    >
      <Grid container alignItems="center" justify="space-between">
        <div>{userName}</div>
        <div>
          <Member member={member} />
        </div>
      </Grid>
    </StyledListItem>
  );
};

const NoMembersElement = () => (
  <StyledListItem>
    <Grid container justify="center">
      No people found
    </Grid>
  </StyledListItem>
);

const AddListForm = ({ setListFormOpen }) => {
  const {
    formLabelContent,
    handleSubmit,
    setValue,
    listOwner,
    adminsPickerOpen,
    openAdminsPicker,
    closeAdminsPicker,
    membersPickerOpen,
    openMembersPicker,
    closeMembersPicker,
    listNameValue,
    listDescriptionValue,
    adminsValue,
    membersValue,
    filteredPeople,
    addAdmin,
    removeAdmin,
    addMember,
    removeMember,
    notificationsValue,
    people,
    taskListIdentifier,
    dispatch,
    searchValue,
    setSearchValue,
  } = initializeAddListFormHooks();

  const adminsWithOwner = [
    ...(adminsValue || []),
    listOwner?.userIdentifier,
  ].filter(Boolean);

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListIdentifier }),
      )}
    >
      {taskListIdentifier && (
        <>
          <Grid container justify="space-between" alignItems="center">
            <FormLabel>
              <MontserratTypography variant="h4">
                {formLabelContent}
              </MontserratTypography>
            </FormLabel>
            <FormIconContainer>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setListFormOpen(false)}
              >
                <Close />
              </IconButton>
            </FormIconContainer>
          </Grid>
          <FormDivider />
        </>
      )}
      <StyledFormControl fullWidth>
        <StyledInputLabel>List name</StyledInputLabel>
        <StyledInputBase
          onChange={event => setValue('listName', event.target.value)}
          value={listNameValue}
          name="listName"
        />
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <StyledInputLabel>Description</StyledInputLabel>
        <StyledInputBase
          onChange={event => setValue('listDescription', event.target.value)}
          value={listDescriptionValue}
          name="listDescription"
        />
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <StyledInputLabel shrink={false}>
          {adminsPickerOpen ? (
            <SearchFieldContainer>
              <SearchField
                autoFocus
                placeholder="Search"
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
              />
              <SearchFieldIcon />
            </SearchFieldContainer>
          ) : (
            'Admins'
          )}
        </StyledInputLabel>
        <StyledInputBase
          name="adminIdentifiers"
          disabled
          endAdornment={
            <MembersContainer>
              <MemberContainer>
                <EmptyMember
                  onClick={() => {
                    if (adminsPickerOpen) {
                      closeAdminsPicker();
                    } else {
                      openAdminsPicker();
                    }
                    closeMembersPicker();
                  }}
                >
                  <EmptyMemberIcon rotated={adminsPickerOpen}>
                    +
                  </EmptyMemberIcon>
                </EmptyMember>
              </MemberContainer>
              {adminsWithOwner?.map(
                renderMember({ people, removePerson: removeAdmin }),
              )}
            </MembersContainer>
          }
        />
      </StyledFormControl>
      <StyledCollapse timeout={150} in={adminsPickerOpen}>
        <StyledList>
          {isEmpty(filteredPeople) ? (
            <NoMembersElement />
          ) : (
            filteredPeople.map(
              renderPickerOption({
                closePicker: closeAdminsPicker,
                addPerson: addAdmin,
              }),
            )
          )}
        </StyledList>
      </StyledCollapse>
      <StyledFormControl fullWidth>
        <StyledInputLabel>
          {membersPickerOpen ? (
            <SearchFieldContainer>
              <SearchField
                autoFocus
                placeholder="Search"
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
              />
              <SearchFieldIcon />
            </SearchFieldContainer>
          ) : (
            'Members'
          )}
        </StyledInputLabel>
        <StyledInputBase
          name="memberIdentifiers"
          disabled
          endAdornment={
            <MembersContainer>
              <MemberContainer>
                <EmptyMember
                  onClick={() => {
                    if (membersPickerOpen) {
                      closeMembersPicker();
                    } else {
                      openMembersPicker();
                    }
                    closeAdminsPicker();
                  }}
                >
                  <EmptyMemberIcon rotated={membersPickerOpen}>
                    +
                  </EmptyMemberIcon>
                </EmptyMember>
              </MemberContainer>
              {membersValue?.map(
                renderMember({ people, removePerson: removeMember }),
              )}
            </MembersContainer>
          }
        />
      </StyledFormControl>
      <StyledCollapse timeout={150} in={membersPickerOpen}>
        <StyledList>
          {isEmpty(filteredPeople) ? (
            <NoMembersElement />
          ) : (
            filteredPeople.map(
              renderPickerOption({
                closePicker: closeMembersPicker,
                addPerson: addMember,
              }),
            )
          )}
        </StyledList>
      </StyledCollapse>
      <Spacing vertical={4} />
      <Grid container alignItems="center" justify="space-between" wrap="nowrap">
        <div>
          <MontserratTypography variant="h4" weight="600">
            Emails and Push Notifications
          </MontserratTypography>
          <MontserratTypography variant="h4">
            Notify me via email or push notifications to mobile phone when there
            is a new activity.
          </MontserratTypography>
        </div>
        <Spacing horizontal={3} />
        <StyledSwitchUnbound
          checked={notificationsValue}
          onChange={() => setValue('notifications', !notificationsValue)}
        />
      </Grid>
      <Spacing vertical={4} />
      <Grid container justify="flex-end" direction="row" wrap="nowrap">
        <>
          <StyledButton
            variant="text"
            onClick={() => setListFormOpen(false)}
            size="small"
            style={{
              textDecoration: 'underline',
            }}
          >
            <MontserratTypography variant="h4" color="inherit" weight="600">
              CANCEL
            </MontserratTypography>
          </StyledButton>
          <Spacing horizontal={4} />
        </>
        <StyledButton variant="contained" type="submit" size="small">
          SAVE LIST
        </StyledButton>
      </Grid>
    </FormContainer>
  );
};

export default AddListForm;
