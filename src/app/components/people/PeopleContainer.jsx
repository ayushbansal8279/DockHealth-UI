import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';

import * as PeopleActions from '../../actions/people-actions';
import Member from '../members/Member';
import BooleanModal from '../modals/BooleanModal';
import { noop } from '../../helpers/utility-functions';
import PeopleContainerRoleButton from './PeopleContainer.RoleButton';

class PeopleContainer extends PureComponent {
  componentWillUnmount() {
    const { peoplelist } = this.props;
    // eslint-disable-next-line no-unused-expressions
    peoplelist?.forEach(({ userId }) =>
      removeRevealComponent(`#delete-user-${userId}`),
    );
  }

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
      return `${phoneNumberWithoutAreaCode.slice(
        0,
        3,
      )}-${phoneNumberWithoutAreaCode.slice(
        3,
        6,
      )}-${phoneNumberWithoutAreaCode.slice(6, 15)}`;
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

  renderStatus = person => {
    if (!person.userInviteStatus || person.userInviteStatus === 'ACCEPTED') {
      if (person.orgUserRole === 'OWNER') {
        return <span>Owner</span>;
      }

      if (person.orgUserRole === 'ADMIN') {
        return <span>Admin</span>;
      }
    } else if (person.userInviteStatus === 'PENDING') {
      return <span>Invited</span>;
    }

    return <span />;
  };

  renderTitles = ({ titles }) =>
    titles?.map(({ name }) => name).join(', ') ?? '';

  renderSpecialties = person =>
    person.specialties?.map(specialty => {
      const joinedSubspecialtyNames =
        specialty.subSpecialties
          ?.map(subspecialty => subspecialty.subSpecialtyName)
          .join(', ')
          .trim() ?? '';

      const subspecialties = `(${joinedSubspecialtyNames})`
        .replace(/^\(\)$/, '')
        .trim();

      return `${specialty.name} ${subspecialties}`.trim();
    }) ?? '';

  renderList() {
    const {
      userProfile,
      changeUserRoleForOrg,
      cancelInviteToOrganization,
      resendInviteToOrganization,
      removeUserFromOrganization,
      peoplelist,
      searchTerm,
    } = this.props;

    const KEYS_TO_FILTERS = [
      'userName',
      'email',
      'homePhoneNumber',
      'faxNumber',
      'workPhoneNumber',
    ];

    const filteredPeople =
      peoplelist?.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) ?? [];

    return filteredPeople.map(person => {
      return (
        <div
          className="item row expanded"
          key={`${person.email}_${person.userId}`}
        >
          <div className="columns shrink pending">
            <Member member={person} />
          </div>
          <div className="columns">
            <span className="item-title">
              <Link
                to={`/assignedToPerson/${person.userId}/${person.firstName} ${person.lastName}`}
              >
                {`${person.firstName} ${person.lastName}`}
              </Link>
            </span>
            <span className="item-details">{this.renderTitles(person)}</span>
            <span className="item-details">
              {this.renderSpecialties(person)}
            </span>
            <span className="top-buffer-xsmall item-details">
              {person.email}
            </span>
            <span className="item-details">
              C: {this.addDashes(person.accountPhoneNumber)} | W:{' '}
              {this.addDashes(person.workPhoneNumber)}
            </span>
            <span className="item-details highlight">
              {this.renderStatus(person)}
            </span>
          </div>

          <PeopleContainerRoleButton
            person={person}
            userProfile={userProfile}
            changeUserRoleForOrg={changeUserRoleForOrg}
            cancelInviteToOrganization={cancelInviteToOrganization}
            resendInviteToOrganization={resendInviteToOrganization}
            removeUserFromOrganization={removeUserFromOrganization}
            handleClick={this.handleClick}
          />

          <BooleanModal
            uniqueModalId={`delete-user-${person.userId}`}
            message="Are you sure you want to delete this user?"
            handleConfirmation={this.onClickRemoveUser}
            handleConfirmationArgs={person.userId}
            confirmBtnTxt="Delete"
          />
        </div>
      );
    });
  }

  render() {
    return <div className="item-list-wrapper">{this.renderList()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    peoplelist: state.peopleState.peoplelist,
    userProfile: state.userState.userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeopleActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleContainer);
