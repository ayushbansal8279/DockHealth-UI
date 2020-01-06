/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import always from 'ramda/es/always';
import cond from 'ramda/es/cond';
import isEmpty from 'ramda/es/isEmpty';
import T from 'ramda/es/T';
import React, { useRef } from 'react';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import AdminIcon from '../../img/admin-icon.svg';
import CancelInvitationIcon from '../../img/cancel-invitation-icon.svg';
// import DirectoryIcon from '../../img/directory-icon.svg';
import ResendInvitationIcon from '../../img/resend-invitation-icon.svg';
import ThreeDotsIcon from '../../img/three-dots.svg';

// const DELETE_THIS_PERSON_LABEL = 'Archive this person';

const StyledIconButton = withStyles({
  label: {
    height: '1.5rem',
    width: '1.5rem',
  },
})(IconButton);

const EllipsisImage = styled.img.attrs({
  alt: 'ellipses',
  src: ThreeDotsIcon,
})`
  height: 100%;
  object-fit: contain;
  object-position: center center;
  width: 100%;
`;

const getListElements = ({
  person,
  userProfile,
  changeUserRoleForOrg,
  cancelInviteToOrganization,
  resendInviteToOrganization,
  // removeUserFromOrganization,
  handleClick,
  unsetPopoverOpen,
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
        <MenuItem
          key="resend-invite"
          onClick={() => {
            resendInviteToOrganization(person.email);
            unsetPopoverOpen();
          }}
        >
          <ListItemIcon>
            <img alt="Arrow icon" src={ResendInvitationIcon} />
          </ListItemIcon>
          <ListItemText>Resend Invitation</ListItemText>
        </MenuItem>,
        <MenuItem
          key="cancel-invite"
          onClick={() => {
            handleClick({
              onClickAction: cancelInviteToOrganization,
            })(person.email);
            unsetPopoverOpen();
          }}
        >
          <ListItemIcon>
            <img alt="Cross icon" src={CancelInvitationIcon} />
          </ListItemIcon>
          <ListItemText>Cancel Invitation</ListItemText>
        </MenuItem>,
      ]),
    ],
    [
      always(isPersonMemberOrUnknown && !isPersonPending),
      always([
        <MenuItem
          key="change-user-role"
          onClick={() => {
            handleClick({ onClickAction: changeUserRoleForOrg })(
              person.userId,
              person.orgUserRole === 'MEMBER' ? 'ADMIN' : 'MEMBER',
            );
            unsetPopoverOpen();
          }}
        >
          <ListItemIcon>
            <img alt="Admin icon" src={AdminIcon} />
          </ListItemIcon>
          <ListItemText>Make admin</ListItemText>
        </MenuItem>,
        // <MenuItem
        //   key="remove-user-with-popup"
        //   data-open={`delete-user-${person.userId}`}
        // >
        //   <ListItemIcon>
        //     <img alt="Directory icon" src={DirectoryIcon} />
        //   </ListItemIcon>
        //   <ListItemText>{DELETE_THIS_PERSON_LABEL}</ListItemText>
        // </MenuItem>,
      ]),
    ],
    [
      always(isPersonOwner && !isPersonPending),
      always([
        // <MenuItem
        //   key="remove-user"
        //   onClick={() => {
        //     this.handleClick({
        //       onClickAction: removeUserFromOrganization,
        //     })(person.userId);
        //     unsetPopoverOpen();
        //   }}
        // >
        //   <ListItemIcon>
        //     <img alt="Directory icon" src={DirectoryIcon} />
        //   </ListItemIcon>
        //   <ListItemText>{DELETE_THIS_PERSON_LABEL}</ListItemText>
        // </MenuItem>,
      ]),
    ],
    [
      T,
      always([
        <MenuItem
          key="remove-admin-rights"
          onClick={() => {
            this.handleClick({ onClickAction: changeUserRoleForOrg })(
              person.userId,
              person.orgUserRole,
            );
            unsetPopoverOpen();
          }}
        >
          <ListItemIcon>
            <img alt="Admin icon" src={AdminIcon} />
          </ListItemIcon>
          <ListItemText>Remove admin rights</ListItemText>
        </MenuItem>,
        // <MenuItem
        //   key="delete-person"
        //   data-open={`delete-user-${person.userId}`}
        // >
        //   <ListItemIcon>
        //     <img alt="Directory icon" src={DirectoryIcon} />
        //   </ListItemIcon>
        //   <ListItemText>{DELETE_THIS_PERSON_LABEL}</ListItemText>
        // </MenuItem>,
      ]),
    ],
  ])();

  return cond([
    [
      always(isCurrentUser),
      always([
        <MenuItem
          key="leave-organization"
          data-open={`delete-user-${person.userId}`}
        >
          <ListItemIcon>
            <img alt="Cross icon" src={CancelInvitationIcon} />
          </ListItemIcon>
          <ListItemText>Leave Organization</ListItemText>
        </MenuItem>,
      ]),
    ],
    [always(isCurrentUserAdminOrOwner), always(listItemsForCurrentAdminUser)],
    [T, always([])],
  ])();
};

export default props => {
  const buttonReference = useRef(null);
  const [popoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);
  const { person, ...otherProps } = props;

  const listElements = getListElements({
    person,
    unsetPopoverOpen,
    ...otherProps,
  });

  if (isEmpty(listElements)) {
    return null;
  }

  return (
    <Grid container alignItems="center" justify="flex-end">
      <StyledIconButton buttonRef={buttonReference} onClick={setPopoverOpen}>
        <EllipsisImage />
      </StyledIconButton>
      <Menu
        id="simple-menu"
        anchorEl={buttonReference.current}
        open={popoverOpen}
        onClose={unsetPopoverOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {listElements}
      </Menu>
    </Grid>
  );
};
