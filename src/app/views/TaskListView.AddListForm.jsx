import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { isEmpty } from 'ramda';
import React from 'react';
import { FormContext } from 'react-hook-form';
// import { v4 as uuid } from 'uuid';
import { saveTaskList } from '../actions/tasklist-actions';
import Spacing from '../components/common/Spacing';
import Member from '../components/members/Member';
import { StyledSwitchUnbound } from '../components/userProfileView/StyledSwitch';
import { UniversalMontserratInput } from '../components/userProfileView/UniversalInput';
import { showAlert } from '../helpers/utility-functions';
import TickIcon from '../img/tick-icon';
import { RobotoTypography } from '../theme';
import { MontserratTypography } from '../theme-montserrat';
import {
  EmptyMember,
  EmptyMemberIcon,
  ExtendedFormControl,
  FormContainer,
  FormDivider,
  FormIconContainer,
  FormLabel,
  FullWidthInputContainer,
  MemberContainer,
  MemberNamesLabelContainer,
  MembersContainer,
  MoreMemberLabel,
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
  TickIconContainer,
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

const renderMember = ({ people }) => memberId => {
  return (
    <MemberContainer key={memberId}>
      <Member
        size={40}
        member={
          Array.isArray(people)
            ? people.find(({ userIdentifier }) => userIdentifier === memberId)
            : undefined
        }
      />
    </MemberContainer>
  );
};

const renderPickerOption = ({
  addPerson,
  removePerson,
  peopleIdentifiers,
}) => member => {
  const { firstName, lastName, userIdentifier } = member;

  const userName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

  const isInList = (peopleIdentifiers ?? []).includes(userIdentifier);

  return (
    <StyledListItem
      button
      onClick={() => {
        if (isInList) {
          removePerson({ userIdentifier });
        } else {
          addPerson({ userIdentifier });
        }
      }}
      key={userIdentifier}
    >
      <Grid container alignItems="center" justify="space-between" wrap="nowrap">
        <Grid container alignItems="center" wrap="nowrap">
          <TickIconContainer>
            {isInList && <TickIcon active />}
          </TickIconContainer>
          <Spacing horizontal={3} />
          <MontserratTypography component="div" variant="h4">
            {userName}
          </MontserratTypography>
        </Grid>
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
      <MontserratTypography variant="h4">No people found</MontserratTypography>
    </Grid>
  </StyledListItem>
);

const MoreMembersContainer = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <MemberContainer>
      <MoreMemberLabel>
        <MontserratTypography
          variant="h4"
          weight={count >= 10 ? '600' : 'bold'}
        >
          +{count}
        </MontserratTypography>
      </MoreMemberLabel>
    </MemberContainer>
  );
};

const renderJoinedMembersNames = ({ membersIdentifiers, people }) =>
  (people ?? [])
    .filter(({ userIdentifier }) =>
      (membersIdentifiers ?? []).includes(userIdentifier),
    )
    .map(({ firstName, lastName }) =>
      `${firstName ?? ''} ${lastName ?? ''}`.trim(),
    )
    .join(', ');

const AddListForm = ({ setListFormOpen }) => {
  const {
    formLabelContent,
    handleSubmit,
    setValue,
    adminsPickerOpen,
    openAdminsPicker,
    closeAdminsPicker,
    membersPickerOpen,
    openMembersPicker,
    closeMembersPicker,
    listDescriptionValue,
    allMembersValue,
    membersValue,
    restOfMembersValue,
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
    allAdminsWithOwner,
    adminsWithOwner,
    restOfAdminsWithOwner,
    formContext,
  } = initializeAddListFormHooks();

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListIdentifier }),
      )}
      autoComplete="off"
      autoCorrect="off"
    >
      {taskListIdentifier && (
        <>
          <Grid container justify="space-between" alignItems="center">
            <FormLabel>
              <RobotoTypography variant="h4">
                {formLabelContent}
              </RobotoTypography>
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
      <FormContext {...formContext}>
        <FullWidthInputContainer>
          <UniversalMontserratInput
            label="List name"
            name="listName"
            required
            autoComplete="off"
            autoCorrect="off"
          />
        </FullWidthInputContainer>
      </FormContext>
      <StyledFormControl fullWidth>
        <StyledInputLabel>Description</StyledInputLabel>
        <StyledInputBase
          onChange={event => setValue('listDescription', event.target.value)}
          value={listDescriptionValue}
          name="listDescription"
        />
      </StyledFormControl>
      <ExtendedFormControl>
        <StyledInputLabel
          shrink={!adminsPickerOpen && allAdminsWithOwner?.length > 0}
        >
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
        {adminsPickerOpen ? (
          <div />
        ) : (
          <MemberNamesLabelContainer>
            <MontserratTypography varant="h4">
              {renderJoinedMembersNames({
                membersIdentifiers: allAdminsWithOwner,
                people,
              })}
            </MontserratTypography>
          </MemberNamesLabelContainer>
        )}
        <MembersContainer>
          <MemberContainer zIndex={0}>
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
              <EmptyMemberIcon rotated={adminsPickerOpen}>+</EmptyMemberIcon>
            </EmptyMember>
          </MemberContainer>
          <MoreMembersContainer count={restOfAdminsWithOwner?.length} />
          {adminsWithOwner?.map(renderMember({ people }))}
        </MembersContainer>
      </ExtendedFormControl>
      <StyledCollapse timeout={150} in={adminsPickerOpen}>
        <StyledList>
          {isEmpty(filteredPeople) ? (
            <NoMembersElement />
          ) : (
            filteredPeople.map(
              renderPickerOption({
                addPerson: addAdmin,
                removePerson: removeAdmin,
                peopleIdentifiers: allAdminsWithOwner,
              }),
            )
          )}
        </StyledList>
      </StyledCollapse>
      <ExtendedFormControl>
        <StyledInputLabel
          shrink={!membersPickerOpen && allMembersValue?.length > 0}
        >
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
        {membersPickerOpen ? (
          <div />
        ) : (
          <MemberNamesLabelContainer>
            <MontserratTypography varant="h4">
              {renderJoinedMembersNames({
                membersIdentifiers: allMembersValue,
                people,
              })}
            </MontserratTypography>
          </MemberNamesLabelContainer>
        )}
        <MembersContainer>
          <MemberContainer zIndex={0}>
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
              <EmptyMemberIcon rotated={membersPickerOpen}>+</EmptyMemberIcon>
            </EmptyMember>
          </MemberContainer>
          <MoreMembersContainer count={restOfMembersValue?.length} />
          {membersValue?.map(renderMember({ people }))}
        </MembersContainer>
      </ExtendedFormControl>
      <StyledCollapse timeout={150} in={membersPickerOpen}>
        <StyledList>
          {isEmpty(filteredPeople) ? (
            <NoMembersElement />
          ) : (
            filteredPeople.map(
              renderPickerOption({
                addPerson: addMember,
                removePerson: removeMember,
                peopleIdentifiers: allMembersValue,
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
