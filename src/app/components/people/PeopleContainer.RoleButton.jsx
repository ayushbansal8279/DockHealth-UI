/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import always from 'ramda/es/always';
import cond from 'ramda/es/cond';
import isEmpty from 'ramda/es/isEmpty';
import T from 'ramda/es/T';
import React from 'react';

const DELETE_THIS_PERSON_LABEL = 'Delete this person';

const getListElements = ({
  person,
  userProfile,
  changeUserRoleForOrg,
  cancelInviteToOrganization,
  resendInviteToOrganization,
  removeUserFromOrganization,
  handleClick,
}) => {
  const isCurrentUser =
    person.userId === userProfile.userId &&
    person.userInviteStatus !== 'PENDING';

  const isCurrentUserAdminOrOwner =
    userProfile.orgUserRole === 'ADMIN' ||
    (userProfile.orgUserRole === 'OWNER' &&
      person.userInviteStatus !== 'PENDING');

  const isPersonMemberOrUnknown =
    !person.orgUserRole == null || person.orgUserRole === 'MEMBER';
  const isPersonPending = person.userInviteStatus === 'PENDING';
  const isPersonOwner = person.orgUserRole === 'OWNER';

  const listItemsForCurrentAdminUser = cond([
    [
      always(isPersonMemberOrUnknown && isPersonPending),
      always([
        <li
          key="resend-invite"
          onClick={() => resendInviteToOrganization(person.email)}
        >
          Resend Invite
        </li>,
        <li
          key="cancel-invite"
          onClick={() =>
            handleClick({
              onClickAction: cancelInviteToOrganization,
            })(person.email)
          }
        >
          Cancel Invite
        </li>,
      ]),
    ],
    [
      always(isPersonMemberOrUnknown && !isPersonPending),
      always([
        <li
          key="change-user-role"
          onClick={() =>
            handleClick({ onClickAction: changeUserRoleForOrg })(
              person.userId,
              person.orgUserRole === 'MEMBER' ? 'ADMIN' : 'MEMBER',
            )
          }
        >
          Make admin
        </li>,
        <li
          key="remove-user-with-popup"
          data-open={`delete-user-${person.userId}`}
        >
          {DELETE_THIS_PERSON_LABEL}
        </li>,
      ]),
    ],
    [
      always(isPersonOwner && !isPersonPending),
      always([
        <li
          key="remove-user"
          onClick={() =>
            this.handleClick({
              onClickAction: removeUserFromOrganization,
            })(person.userId)
          }
        >
          {DELETE_THIS_PERSON_LABEL}
        </li>,
      ]),
    ],
    [
      T,
      always([
        <li
          key="remove-admin-rights"
          onClick={() =>
            this.handleClick({ onClickAction: changeUserRoleForOrg })(
              person.userId,
              person.orgUserRole,
            )
          }
        >
          Remove admin rights
        </li>,
        <li key="delete-person" data-open={`delete-user-${person.userId}`}>
          {DELETE_THIS_PERSON_LABEL}
        </li>,
      ]),
    ],
  ])();

  return cond([
    [
      always(isCurrentUser),
      always([
        <li key="leave-organization" data-open={`delete-user-${person.userId}`}>
          Leave organization
        </li>,
      ]),
    ],
    [always(isCurrentUserAdminOrOwner), always(listItemsForCurrentAdminUser)],
    [T, always([])],
  ])();
};

export default props => {
  const { person, ...otherProps } = props;

  const listElements = getListElements({ person, ...otherProps });

  if (isEmpty(listElements)) {
    return null;
  }

  return (
    <div className="columns shrink more-options-wrapper more-options-people">
      <svg
        className="icon ellipses medium"
        data-toggle={`person-actions-${person.userId}${person.firstName}${person.lastName}`}
      >
        <use xlinkHref="#icon-ellipses" />
      </svg>
      <div
        className="small dropdown-pane"
        id={`person-actions-${person.userId}${person.firstName}${person.lastName}`}
        data-dropdown
        data-close-on-click="true"
      >
        <ul className="no-bullet">{listElements}</ul>
      </div>
    </div>
  );
};
