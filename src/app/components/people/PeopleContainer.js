import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';

import * as PeopleActions from '../../actions/people-actions';
import MemberInitials from '../members/MemberInitials';
import BooleanModal from '../modals/BooleanModal';
import Member from '../members/Member';


class PeopleContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      peopleProcessingResult: '',
    };

    this.onClickRoleChange = this.onClickRoleChange.bind(this);
    this.onClickRemoveUser = this.onClickRemoveUser.bind(this);
    this.onClickCancelInvite = this.onClickCancelInvite.bind(this);
  }

  componentWillUnmount() {
    if (this.props.peoplelist) {
      this.props.peoplelist.map(person =>
        removeRevealComponent(`#delete-user-${person.userId}`),
      );
    }
  }

  onClickRoleChange(markedUserId, currentRole) {
    let newRole;
    if (currentRole === 'ADMIN') {
      newRole = 'MEMBER';
    } else {
      newRole = 'ADMIN';
    }
    this.props
      .changeUserRoleForOrg(markedUserId, newRole)
      .then(res => {
        this.setState({
          peopleProcessingResult: 'User Role changed successfully!!',
        }); // this will cause render to be called
        this.props.loading();
        this.props.findAllUsersByOrganizationId();
        // hashHistory.push('/updateUserRole')
      })
      .catch(error => {
        this.setState({ peopleProcessingResult: error.message }); // this will cause render to be called
      });
  }

  onClickRemoveUser(markedUserId) {
    this.props
      .removeUserFromOrganization(markedUserId)
      .then(res => {
        this.setState({
          peopleProcessingResult: 'User removed successfully!!',
        }); // this will cause render to be called
        this.props.loading();
        this.props.findAllUsersByOrganizationId();
        // hashHistory.push('/updateUserRole')
      })
      .catch(error => {
        this.setState({ peopleProcessingResult: error.message }); // this will cause render to be called
      });
  }

  onClickCancelInvite(email) {
    this.props
      .cancelInviteToOrganization(email)
      .then(res => {
        this.setState({
          peopleProcessingResult: 'Invitation cancelled successfully!!',
        }); // this will cause render to be called
        this.props.loading();
        this.props.findAllUsersByOrganizationId();
        // hashHistory.push('/updateUserRole')
      })
      .catch(error => {
        this.setState({ peopleProcessingResult: error.message }); // this will cause render to be called
      });
  }

  resendInviteToOrganization = email => {
    this.props.resendInviteToOrganization(email);
  };

  renderRole(person) {
    if (person.orgUserRole == 'OWNER') {
      return <span className=" success label">{person.orgUserRole}</span>;
    }
    if (person.orgUserRole == 'MEMBER' || person.orgUserRole == 'ADMIN') {
      return <span className=" warning label">{person.orgUserRole}</span>;
    }
    return <span />;
  }

  renderRoleButton(person) {
    if (
      person.userId == this.props.userProfile.userId &&
      person.userInviteStatus != 'PENDING'
    ) {
      return (
        <div className="columns shrink more-options-wrapper more-options-people">
          <svg
            className="icon ellipses medium"
            data-toggle={`person-actions-${person.userId}${person.firstName}${
              person.lastName
            }`}
          >
            <use xlinkHref="#icon-ellipses" />
          </svg>
          <div
            className="small dropdown-pane"
            id={`person-actions-${person.userId}${person.firstName}${
              person.lastName
            }`}
            data-dropdown
            data-close-on-click="true"
          >
            <ul className="no-bullet">
              <li data-open={`delete-user-${person.userId}`}>
                Leave organization
              </li>
            </ul>
          </div>
        </div>
      );
    }
    if (
      this.props.userProfile.orgUserRole == 'ADMIN' ||
      (this.props.userProfile.orgUserRole == 'OWNER' &&
        person.userInviteStatus != 'PENDING')
    ) {
      if (
        (person.orgUserRole == null || person.orgUserRole == 'MEMBER') &&
        person.userInviteStatus == 'PENDING'
      ) {
        return (
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg
              className="icon ellipses medium"
              data-toggle={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
            >
              <use xlinkHref="#icon-ellipses" />
            </svg>
            <div
              className="small dropdown-pane"
              id={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
              data-dropdown
              data-close-on-click="true"
            >
              <ul className="no-bullet">
                <li
                  onClick={e => this.resendInviteToOrganization(person.email)}
                >
                  Resend Invite
                </li>
                <li onClick={e => this.onClickCancelInvite(person.email)}>
                  Cancel Invite
                </li>
              </ul>
            </div>
          </div>
        );
      }
      if (
        (person.orgUserRole == null || person.orgUserRole == 'MEMBER') &&
        person.userInviteStatus != 'PENDING'
      ) {
        return (
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg
              className="icon ellipses medium"
              data-toggle={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
            >
              <use xlinkHref="#icon-ellipses" />
            </svg>
            <div
              className="small dropdown-pane"
              id={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
              data-dropdown
              data-close-on-click="true"
            >
              <ul className="no-bullet">
                <li
                  onClick={e =>
                    this.onClickRoleChange(person.userId, person.orgUserRole)
                  }
                >
                  Make admin
                </li>
                <li data-open={`delete-user-${person.userId}`}>
                  Delete this person
                </li>
              </ul>
            </div>
          </div>
        );
      }
      if (
        person.orgUserRole == 'OWNER' &&
        person.userInviteStatus != 'PENDING'
      ) {
        return (
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg
              className="icon ellipses medium"
              data-toggle={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
            >
              <use xlinkHref="#icon-ellipses" />
            </svg>
            <div
              className="small dropdown-pane"
              id={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
              data-dropdown
              data-close-on-click="true"
            >
              <ul className="no-bullet">
                <li onClick={e => this.onClickRemoveUser(person.userId)}>
                  Delete this person
                </li>
              </ul>
            </div>
          </div>
        );
      }
      if (
        person.orgUserRole == 'ADMIN' &&
        person.userInviteStatus != 'PENDING'
      ) {
        return (
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg
              className="icon ellipses medium"
              data-toggle={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
            >
              <use xlinkHref="#icon-ellipses" />
            </svg>
            <div
              className="small dropdown-pane"
              id={`person-actions-${person.userId}${person.firstName}${
                person.lastName
              }`}
              data-dropdown
              data-close-on-click="true"
            >
              <ul className="no-bullet">
                <li
                  onClick={e =>
                    this.onClickRoleChange(person.userId, person.orgUserRole)
                  }
                >
                  Remove admin rights
                </li>
                <li data-open={`delete-user-${person.userId}`}>
                  Delete this person
                </li>
              </ul>
            </div>
          </div>
        );
      }
    }
  }

  renderStatus(person) {
    if (
      person.userInviteStatus == null ||
      person.userInviteStatus == '' ||
      person.userInviteStatus == 'ACCEPTED'
    ) {
      if (person.orgUserRole == 'OWNER') {
        return <span>Owner</span>;
      }
      if (person.orgUserRole == 'ADMIN') {
        return <span>Admin</span>;
      }
    } else if (person.userInviteStatus == 'PENDING') {
      return <span>Invited</span>;
    }
  }

  renderTitles(person) {
    let titles = '';
    if (person.titles != null) {
      person.titles.map(title => {
        if (titles != '') {
          titles = `${titles}, ${title.name}`;
        } else {
          titles = title.name;
        }
      });
    }
    titles = titles.replace('/,s*$/', '');
    return titles;
  }

  renderSpecialties(person) {
    let allSpecialties = '';
    if (person.specialties != null) {
      person.specialties.map(specialty => {
        let tmpSpecialty = '';
        let tmpSubSpecialty = '';
        tmpSpecialty = specialty.name;
        if (specialty.subSpecialties != null) {
          specialty.subSpecialties.map(subSpecialty => {
            if (tmpSubSpecialty != '') {
              tmpSubSpecialty = `${tmpSubSpecialty}, ${
                subSpecialty.subSpecialtyName
              }`;
            } else {
              tmpSubSpecialty = subSpecialty.subSpecialtyName;
            }
          });
          tmpSubSpecialty = tmpSubSpecialty.replace('/,s*$/', '');
        }

        if (tmpSubSpecialty != '') {
          tmpSpecialty = `${tmpSpecialty} (${tmpSubSpecialty})`;
        }

        if (allSpecialties != '') {
          allSpecialties = `${allSpecialties}, ${tmpSpecialty}`;
        } else {
          allSpecialties = tmpSpecialty;
        }
      });
    }
    allSpecialties = allSpecialties.replace('/,s*$/', '');
    return allSpecialties;
  }

  addDashes = f => {
    if (f != undefined && f != '') {
      f = f.replace('+1', '');
      const formattedNumber = `${f.slice(0, 3)}-${f.slice(3, 6)}-${f.slice(
        6,
        15,
      )}`;
      return formattedNumber;
    }
  };

  renderList() {
    // use below if date is coming in as timestamp milliseconds
    // {new Date(invitation.updatedDateTime).toJSON()}
    const KEYS_TO_FILTERS = [
      'userName',
      'email',
      'homePhoneNumber',
      'faxNumber',
      'workPhoneNumber',
    ];
    // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
    let filteredPeople = [];
    if (this.props.peoplelist) {
      filteredPeople = this.props.peoplelist.filter(
        createFilter(this.props.searchTerm, KEYS_TO_FILTERS),
      );
    }
    return filteredPeople.map(person => {

      return (
        <div
          className="item row expanded"
          key={`${person.email}_${person.userId}`}
        >
          <div className="columns shrink pending">
            {/* <img className="member-photo circle" src="assets/img/user3.png" alt="name of user"/> */}
            {/* <span className="member-initials circle">{person.initials}</span> */}
            <Member member={person} />
          </div>
          <div className="columns">
            <span className="item-title">
              <Link
                to={`/assignedToPerson/${person.userId}/${person.firstName} ${
                  person.lastName
                }`}
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

          {this.renderRoleButton(person)}

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
