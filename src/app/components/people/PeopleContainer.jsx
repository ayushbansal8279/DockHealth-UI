import { Grid } from '@material-ui/core';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'ramda';
import * as PeopleActions from 'actions/people-actions';
import { noop } from 'helpers/utility-functions';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import Member from '../members/Member';
import {
  ListContainer,
  ListEntryContainer,
  MemberContainer,
  PersonStatus,
} from './PeopleContainer.Styled';

class PeopleContainer extends PureComponent {
  handleClick = ({ onClickAction }) => (...actionArguments) => {
    const { findAllUsersByOrganizationId, loading } = this.props;

    onClickAction(...actionArguments)
      .then(() => {
        loading();
        findAllUsersByOrganizationId();
      })
      .catch(noop);
  };

  addDashes = phoneNumber => {
    if (phoneNumber) {
      const phoneNumberWithoutAreaCode = phoneNumber.replace('+1', '');

      return phoneNumberWithoutAreaCode.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        '($1) $2-$3',
      );
    }

    return phoneNumber;
  };

  renderRole = person => {
    if (person.orgUserRole === 'OWNER') {
      return <span className="success label">{person.orgUserRole}</span>;
    }

    if (person.orgUserRole === 'MEMBER' || person.orgUserRole === 'ADMIN') {
      return <span className="warning label">{person.orgUserRole}</span>;
    }

    return <span />;
  };

  getStatus = person => {
    if (
      person.userStatus === 'ACTIVE' &&
      (!person.userInviteStatus || person.userInviteStatus === 'ACCEPTED')
    ) {
      if (person.orgUserRole === 'OWNER') {
        return 'Owner';
      }
      if (person.orgUserRole === 'ADMIN') {
        return 'Admin';
      }
      if (person.orgUserRole === 'MEMBER') {
        return 'Member';
      }
    } else if (
      person.userStatus === 'INVITED' ||
      person.userInviteStatus === 'PENDING'
    ) {
      return 'Invited';
    }

    return '';
  };

  getTitles = ({ titles }) => titles?.map(({ name }) => name).join(', ') ?? '';

  getSpecialties = person =>
    person.specialties
      ?.map(specialty => {
        const joinedSubspecialtyNames =
          specialty.subSpecialties
            ?.map(subspecialty => subspecialty.subSpecialtyName)
            .join(', ')
            .trim() ?? '';

        const subspecialties = `(${joinedSubspecialtyNames})`
          .replace(/^\(\)$/, '')
          .trim();

        return `${specialty.name} ${subspecialties}`.trim();
      })
      .join(', ') ?? '';

  renderListEntry = person => {
    const personName = `${person.firstName || ''} ${person.middleName ||
      ''} ${person.lastName || ''}`
      .trim()
      .replace(/^,\s*/, '');

    const titles = `${this.getTitles(person)} - ${this.getSpecialties(person)}`
      .trim()
      .replace(/^\s*-|-\s*$/, '');

    const personStatus = this.getStatus(person);

    return (
      <ListEntryContainer key={person.userIdentifier + personName}>
        <Grid direction="row" wrap="nowrap" container spacing={2}>
          <MemberContainer
            style={{ opacity: personStatus === 'Invited' ? 0.4 : 1 }}
          >
            <Link
              to={`/assignedToPerson/${encodeURIComponent(
                person.userIdentifier,
              )}`}
            >
              <Member color={palette.unknownGrey5} member={person} />
            </Link>
          </MemberContainer>
          <Grid item container alignItems="center">
            <Grid
              item
              xs={12}
              style={{ opacity: personStatus === 'Invited' ? 0.4 : 1 }}
            >
              <Link
                to={`/assignedToPerson/${encodeURIComponent(
                  person.userIdentifier,
                )}`}
              >
                {personName}
              </Link>
            </Grid>
            {titles && (
              <Grid
                item
                container
                alignItems="center"
                xs={12}
                direction="row"
                wrap="nowrap"
              >
                <span>{titles}</span>
              </Grid>
            )}
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            style={{ opacity: personStatus === 'Invited' ? 0.4 : 1 }}
          >
            <PersonStatus>{personStatus}</PersonStatus>
          </Grid>
        </Grid>
      </ListEntryContainer>
    );
  };

  renderEmptyEntry = () => (
    <ListEntryContainer>
      <Grid container justify="center" alignItems="center">
        <RobotoTypography variant="h4">No providers found</RobotoTypography>
      </Grid>
    </ListEntryContainer>
  );

  render = () => {
    const { peopleList, searchTerm } = this.props;

    const KEYS_TO_FILTERS = [
      'userName',
      'email',
      'homePhoneNumber',
      'faxNumber',
      'workPhoneNumber',
    ];

    const filteredPeople =
      peopleList?.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) ?? [];

    return (
      <ListContainer>
        {isEmpty(filteredPeople)
          ? this.renderEmptyEntry()
          : filteredPeople.map(this.renderListEntry)}
      </ListContainer>
    );
  };
}

function mapStateToProps(state) {
  return {
    userProfile: state.userState.userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeopleActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
