import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import TickIcon from 'img/tick-icon';
import { isEmpty } from 'ramda';

import CrossIcon from 'img/cross';
import Member from 'components/members/Member';
import Input from 'components/common/Input/Input';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { MontserratTypography } from 'styles/theme-montserrat';
import { TickIconContainer } from '../../ListForm/styled';
import {
  EmptyPeople,
  MorePeopleLabel,
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
        <div>
          <Member member={member} size="38" />
        </div>
      </Grid>
    </PeopleListItem>
  );
};

const renderSelectedPeople = (id, peopleList) => (
  <Member
    key={id}
    size={40}
    member={
      Array.isArray(peopleList) &&
      peopleList.find(({ userIdentifier }) => userIdentifier === id)
    }
  />
);

const EmptyFilteredPeople = () => (
  <PeopleListItem>
    <Grid container justify="center">
      <MontserratTypography variant="h4">No people found</MontserratTypography>
    </Grid>
  </PeopleListItem>
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

const PeoplePicker = ({
  addPerson,
  availablePeopleList,
  closePicker,
  isOpen,
  peopleIdentifiers,
  peopleList,
  peopleLabel,
  setOpenedPicker,
  removePerson,
  tooltipDescritpion,
}) => {
  const [searchValue, setSearchValue] = useState('');

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

  return (
    <>
      <PeoplePickerBox>
        <SelectedPeople>
          <SelectedPeopleNames>
            <PeopleLabel hasSelectedPeople={joinedPeopleNames}>
              <span>{peopleLabel}</span>
              {tooltipDescritpion && (
                <Tooltip description={tooltipDescritpion} />
              )}
            </PeopleLabel>
            <PeopleNames>{joinedPeopleNames}</PeopleNames>
          </SelectedPeopleNames>
          <SelectedPeopleIcons>
            {peopleIdentifiers
              ?.slice(0, VISIBLE_PEOPLE_ICONS)
              .map(id => renderSelectedPeople(id, peopleList))}
            <MorePeopleContainer
              count={peopleIdentifiers?.length - VISIBLE_PEOPLE_ICONS}
            />
            <EmptyPeople onClick={isOpen ? closePicker : setOpenedPicker}>
              <PeopleCrossIcon rotated={isOpen} src={CrossIcon} />
            </EmptyPeople>
          </SelectedPeopleIcons>
        </SelectedPeople>
      </PeoplePickerBox>
      <PeopleListBox timeout={150} in={isOpen}>
        <Input
          label="Search"
          onChange={event => setSearchValue(event.target.value)}
        />
        <PeopleList>
          {isEmpty(filteredPeople) ? (
            <EmptyFilteredPeople />
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
      </PeopleListBox>
    </>
  );
};

export default PeoplePicker;
