import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import Avatar from '../common/Avatar';
import { AvatarImageContainer } from '../common/Avatar.styled';

const StyledListItem = styled(ListItem)`
  && {
    background: #007cab;
    height: 88px;
    min-height: 88px;
    :focus {
      background-color: #007cab;
    }
    :hover {
      background-color: #007cab;
    }
  }
  &&.active {
    background-color: #007cab;
    :hover {
      background-color: #007cab;
    }
  }
`;

const DropdownListItem = styled(StyledListItem)`
  && {
    color: #fff;
    height: 2.6875rem;
    margin: 1.3125rem 0;
    min-height: 2.6875rem;
    transition: all 0.25s ease-out;

    :first-child {
      margin-top: 0.3125rem;
    }

    :hover {
      background-color: #3496bc;
    }
  }
  &&.active {
    background-color: #1a89b3;
    :hover {
      background-color: #3496bc;
    }
  }
`;

const Name = styled.div`
  color: #fff;
  font-size: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDropdown = styled.div`
  background-color: #007cab;
  height: ${props => (props.open ? 16 : 0)}rem;
  overflow: hidden;
  transition: height 0.25s ease-out;
  width: 100%;
`;

const StyledLink = React.forwardRef((props, reference) => {
  const linkActive = hashHistory.getCurrentLocation().pathname === props.link;

  return (
    <Link
      innerRef={reference}
      to={props.link}
      activeClassName="active"
      className={linkActive ? 'active' : ''}
      style={{
        color: '#fff',
      }}
      {...props}
      onClick={event => {
        if (linkActive) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // eslint-disable-next-line no-unused-expressions
          props?.onClick(event);
        }
      }}
    />
  );
});

const DrawerHeader = ({ user }) => {
  const nameReference = useRef(null);
  const buttonReference = useRef(null);

  const userProfilePic = useSelector(state => state.userState.userProfilePic);
  const { access: userProfileAccess, orgUserRole } = useSelector(
    state => state.userState.userProfile || {},
  );

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const avatarInitials = user?.initials ?? '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  const userProfileEnabled = userProfileAccess?.userProfileEnabled;
  const linkComponent = userProfileEnabled ? StyledLink : undefined;

  return (
    <>
      <StyledListItem
        onMouseEnter={userProfileEnabled && openPopover}
        onMouseLeave={closePopover}
        innerRef={buttonReference}
      >
        <ListItemIcon
          style={{
            marginLeft: '-2px',
          }}
        >
          <Avatar withCursor size={55}>
            {avatarContent}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          style={{
            padding: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <Name ref={nameReference}>{fullName}</Name>
          </div>
        </ListItemText>
      </StyledListItem>
      <StyledDropdown
        open={isPopoverOpen}
        onMouseEnter={userProfileEnabled && openPopover}
        onMouseLeave={closePopover}
      >
        <DropdownListItem
          button
          onClick={closePopover}
          component={linkComponent}
          link="/userProfile"
        >
          Profile & Settings
        </DropdownListItem>
        {isUserAdmin && (
          <>
            <DropdownListItem
              button
              onClick={closePopover}
              component={linkComponent}
              link="/subscriptions"
            >
              Subscription & Users
            </DropdownListItem>
            <DropdownListItem
              button
              onClick={closePopover}
              component={linkComponent}
              link="/billings"
            >
              Billing & Invoices
            </DropdownListItem>
            <DropdownListItem
              button
              onClick={closePopover}
              component={linkComponent}
              link="/documents"
            >
              Documents & Agreements
            </DropdownListItem>
          </>
        )}
      </StyledDropdown>
    </>
  );
};

export default DrawerHeader;
