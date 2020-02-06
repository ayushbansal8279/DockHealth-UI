import Grid from '@material-ui/core/Grid';
import { isEmpty } from 'ramda';
import React from 'react';
import { saveTaskList } from '../actions/tasklist-actions';
import Member from '../components/members/Member';
import { StyledSwitchUnbound } from '../components/userProfileView/StyledSwitch';
import {
  SectionSubtypography,
  SectionTypography,
} from '../components/userProfileView/UserProfileView.Styled';
import { showAlert } from '../helpers/utility-functions';
import {
  CloseButton,
  EmptyMember,
  EmptyMemberIcon,
  FormContainer,
  FormDivider,
  FormLabel,
  InputFieldSpacer,
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

const onSubmit = ({ dispatch, setListFormOpen, taskListId = null }) => data => {
  const taskList = { ...data, taskListId };

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
        onClick={() => removePerson({ userId: memberId })}
        member={people.find(({ userId }) => userId === memberId)}
      />
    </MemberContainer>
  );
};

const renderPickerOption = ({ closePicker, addPerson }) => member => {
  const { firstName, lastName, userId } = member;

  const userName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  return (
    <StyledListItem
      button
      onClick={() => {
        addPerson({ userId });
        closePicker();
      }}
      key={userId}
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

const AddListForm = ({ setListFormOpen, cancelButtonShown }) => {
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
    adminsValue,
    membersValue,
    filteredPeople,
    addAdmin,
    removeAdmin,
    addMember,
    removeMember,
    notificationsValue,
    people,
    taskListId,
    dispatch,
    searchValue,
    setSearchValue,
  } = initializeAddListFormHooks();

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListId }),
      )}
    >
      <Grid container justify="space-between" alignItems="center">
        <FormLabel>{formLabelContent}</FormLabel>
        {cancelButtonShown && (
          <CloseButton onClick={() => setListFormOpen(false)}>
            &times;
          </CloseButton>
        )}
      </Grid>
      <FormDivider />
      <StyledFormControl fullWidth>
        <StyledInputLabel>List name</StyledInputLabel>
        <StyledInputBase
          onChange={event => setValue('listName', event.target.value)}
          value={listNameValue}
          name="listName"
        />
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <StyledInputLabel>Owner</StyledInputLabel>
        <StyledInputBase
          name="owner"
          disabled
          endAdornment={
            <MembersContainer>
              <MemberContainer>
                <Member member={listOwner} />
              </MemberContainer>
            </MembersContainer>
          }
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
          name="admins"
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
              {adminsValue?.map(
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
          name="members"
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
      <InputFieldSpacer />
      <b>Notifications</b>
      <FormDivider />
      <Grid container alignItems="center" justify="space-between">
        <div>
          <SectionTypography>Emails and Push Notifications</SectionTypography>
          <SectionSubtypography>
            Notify me via email or push notifications to mobile phone when there
            is a new activity.
          </SectionSubtypography>
        </div>
        <StyledSwitchUnbound
          checked={notificationsValue}
          onChange={() => setValue('notifications', !notificationsValue)}
        />
      </Grid>
      <Grid container justify="flex-end">
        {cancelButtonShown && (
          <StyledButton
            variant="outlined"
            onClick={() => setListFormOpen(false)}
          >
            Cancel
          </StyledButton>
        )}
        <StyledButton variant="contained" type="submit">
          Save
        </StyledButton>
      </Grid>
    </FormContainer>
  );
};

export default AddListForm;
