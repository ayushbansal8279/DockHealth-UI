import Grid from '@material-ui/core/Grid';
import React from 'react';
import Swal from 'sweetalert2';
import Member from '../components/members/Member';
import { StyledSwitchUnbound } from '../components/userProfileView/StyledSwitch';
import {
  SectionTypography,
  SectionSubtypography,
} from '../components/userProfileView/UserProfileView.Styled';
import initializeAddListFormHooks from './TaskListView.AddListForm.Hooks';
import { saveTaskList } from '../actions/tasklist-actions';

import {
  FormContainer,
  FormLabel,
  FormDivider,
  StyledFormControl,
  StyledInputLabel,
  StyledInputBase,
  MemberContainer,
  MembersContainer,
  EmptyMember,
  InputFieldSpacer,
  StyledCollapse,
  StyledListItem,
  StyledList,
  StyledButton,
} from './TaskListView.AddListForm.Components';

const onSubmit = ({ dispatch, setListFormOpen, taskListId = null }) => data => {
  const taskList = { ...data, taskListId };

  saveTaskList(taskList)(dispatch)
    .then(() => {
      Swal.fire({
        icon: 'success',
        toast: true,
        position: 'top-end',
        title: 'Task list saved successfully!',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      Swal.getContainer().style.zIndex = 10000;
      setListFormOpen(false);
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error?.message ?? 'Failed to save task list, please try again later',
      });
      Swal.getContainer().style.zIndex = 10000;
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
  } = initializeAddListFormHooks();

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListId }),
      )}
    >
      <FormLabel>{formLabelContent}</FormLabel>
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
        <StyledInputLabel>Admins</StyledInputLabel>
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
                  +
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
          {filteredPeople.map(
            renderPickerOption({
              closePicker: closeAdminsPicker,
              addPerson: addAdmin,
            }),
          )}
        </StyledList>
      </StyledCollapse>
      <StyledFormControl fullWidth>
        <StyledInputLabel>Members</StyledInputLabel>
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
                  +
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
          {filteredPeople.map(
            renderPickerOption({
              closePicker: closeMembersPicker,
              addPerson: addMember,
            }),
          )}
        </StyledList>
      </StyledCollapse>
      <InputFieldSpacer />
      <b>Notifications</b>
      <FormDivider />
      <Grid container alignItems="center" justify="space-between">
        <div>
          <SectionTypography>Emails</SectionTypography>
          <SectionSubtypography>
            Notify me via email when there is a new activity.
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
