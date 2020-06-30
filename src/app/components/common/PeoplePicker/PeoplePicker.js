/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'ramda';
import { Grid } from '@material-ui/core';
import TickIcon from 'img/tick-icon';
import MailIcon from 'img/mail';
import CrossIcon from 'img/cross';
import useBoolean from 'hooks/useBoolean';
import Member from 'components/members/Member';
import Input from 'components/common/Input/Input';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { MontserratTypography } from 'styles/theme-montserrat';
import { TickIconContainer } from '../../ListForm/styled';
import InviteForm from './InviteForm/InviteForm';
import messages from './messages';
import {
  Container,
  EmptyPeople,
  InviteButton,
  InvitedPeopleNames,
  MorePeopleLabel,
  NotFoundPeopleBox,
  PeoplePickerBox,
  PeopleListBox,
  PeopleList,
  PeopleListItem,
  PeopleName,
  PeopleNames,
  PeopleCrossIcon,
  PeopleLabel,
  SelectedPeople,
  SelectedPeopleIcons,
  SelectedPeopleNames,
} from './styled';

const VISIBLE_PEOPLE_ICONS = 3;

const renderPickerOption = ({
  addPerson,
  removePerson,
  peopleIdentifiers,
}) => member => {
  const { firstName, lastName, userIdentifier } = member;
  const userName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  const isInList = (peopleIdentifiers ?? []).includes(userIdentifier);

  return (
    <PeopleListItem
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
          <PeopleName>{userName}</PeopleName>
        </Grid>
        <Member member={member} size="38" />
      </Grid>
    </PeopleListItem>
  );
};

const renderSelectedPeople = (id, peopleList) => (
  <Member
    key={id}
    size={38}
    member={
      Array.isArray(peopleList) &&
      peopleList.find(({ userIdentifier }) => userIdentifier === id)
    }
  />
);

const EmptyFilteredPeople = ({ openInviteForm, hasAdminRole }) => (
  <NotFoundPeopleBox>
    <MontserratTypography variant="h4">No people found</MontserratTypography>
    {hasAdminRole && (
      <InviteButton
        variant="contained"
        type="button"
        size="small"
        onClick={openInviteForm}
        startIcon={<img src={MailIcon} alt="mail" />}
      >
        {messages.peoplePicker.invite.label}
      </InviteButton>
    )}
  </NotFoundPeopleBox>
);

const MorePeopleContainer = ({ count }) => {
  if (count <= 0) return null;

  return (
    <MorePeopleLabel>
      <MontserratTypography variant="h4" weight={count >= 10 ? '600' : 'bold'}>
        +{count}
      </MontserratTypography>
    </MorePeopleLabel>
  );
};

const joinSelecetedPeopleNames = (peopleIdentifiers = [], peopleList = []) =>
  peopleList
    .filter(({ userIdentifier }) => peopleIdentifiers.includes(userIdentifier))
    .map(({ firstName, lastName }) =>
      `${firstName ?? ''} ${lastName ?? ''}`.trim(),
    )
    .join(', ');

const getCrossIconAction = (pickerState, inviteFormState) => {
  const { isOpenPicker, closePicker, openPicker } = pickerState;
  const { isOpenForm, closeForm } = inviteFormState;

  if (isOpenPicker && !isOpenForm) return closePicker;
  if (!isOpenPicker && isOpenForm) return closeForm;

  return openPicker;
};

const PeoplePicker = ({
  addPerson,
  availablePeopleList,
  closePicker,
  currentUserRole,
  isOpen,
  openModal,
  peopleIdentifiers,
  peopleList,
  peopleLabel,
  setOpenedPicker,
  removePerson,
  taskListIdentifier,
  tooltipDescritpion,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showInviteForm, openInviteForm, closeInviteForm] = useBoolean(false);
  const [invitedPeople, addInvitedPeople] = useState([]);
  const searchInputReference = useRef(null);

  useEffect(() => {
    if (showInviteForm) {
      closePicker();
    }
  }, [closePicker, showInviteForm]);

  useEffect(() => {
    if (!isOpen && !showInviteForm) {
      setSearchValue('');
    }
  }, [isOpen, showInviteForm]);

  useEffect(() => {
    if (searchInputReference && isOpen) {
      searchInputReference.current.focus();
    }
  }, [searchInputReference, isOpen]);

  const filteredPeople = Array.isArray(availablePeopleList)
    ? availablePeopleList.filter(
        ({ firstName = '', middleName = '', lastName = '' }) =>
          [
            firstName.toLowerCase(),
            middleName.toLowerCase(),
            lastName.toLowerCase(),
          ]
            .map(value => value.includes(searchValue.toLowerCase()))
            .some(Boolean),
      )
    : [];

  const joinedPeopleNames = joinSelecetedPeopleNames(
    peopleIdentifiers,
    peopleList,
  );

  const joinedInvitedPeople = invitedPeople?.join(', ');

  const [firstName, lastName] = searchValue?.split(' ');

  const hasAdminRole = currentUserRole === 'ADMIN';

  return (
    <Container>
      <PeoplePickerBox>
        <SelectedPeople>
          <SelectedPeopleNames>
            <PeopleLabel hasSelectedPeople={joinedPeopleNames}>
              <span>{peopleLabel}</span>
              {tooltipDescritpion && (
                <Tooltip description={tooltipDescritpion} />
              )}
            </PeopleLabel>
            <PeopleNames>
              {joinedPeopleNames}
              {joinedPeopleNames && joinedInvitedPeople && ', '}
              <InvitedPeopleNames>{joinedInvitedPeople}</InvitedPeopleNames>
            </PeopleNames>
          </SelectedPeopleNames>
          <SelectedPeopleIcons>
            {peopleIdentifiers
              ?.slice(0, VISIBLE_PEOPLE_ICONS)
              .map(id => renderSelectedPeople(id, peopleList))}
            <MorePeopleContainer
              count={peopleIdentifiers?.length - VISIBLE_PEOPLE_ICONS}
            />
            <EmptyPeople
              onClick={getCrossIconAction(
                {
                  isOpenPicker: isOpen,
                  closePicker,
                  openPicker: setOpenedPicker,
                },
                {
                  isOpenForm: showInviteForm,
                  closeForm: closeInviteForm,
                },
              )}
            >
              <PeopleCrossIcon
                rotated={isOpen || showInviteForm}
                src={CrossIcon}
              />
            </EmptyPeople>
          </SelectedPeopleIcons>
        </SelectedPeople>
      </PeoplePickerBox>
      <PeopleListBox timeout={150} in={isOpen || showInviteForm}>
        <Input
          ref={searchInputReference}
          label={messages.peoplePicker.search.label}
          onChange={event => setSearchValue(event.target.value)}
          value={searchValue}
          disabled={showInviteForm}
        />
        {showInviteForm && (
          <InviteForm
            addPerson={addPerson}
            addInvitedPeople={name =>
              addInvitedPeople([...invitedPeople, name])
            }
            closeInviteForm={closeInviteForm}
            hasAdminRole={hasAdminRole}
            initialValues={{ firstName, lastName }}
            openModal={openModal}
            taskListIdentifier={taskListIdentifier}
          />
        )}
        {!showInviteForm && (
          <PeopleList>
            {isEmpty(filteredPeople) ? (
              <EmptyFilteredPeople
                openInviteForm={openInviteForm}
                hasAdminRole={hasAdminRole}
              />
            ) : (
              filteredPeople.map(
                renderPickerOption({
                  peopleIdentifiers,
                  addPerson,
                  removePerson,
                }),
              )
            )}
          </PeopleList>
        )}
      </PeopleListBox>
    </Container>
  );
};

export default PeoplePicker;
