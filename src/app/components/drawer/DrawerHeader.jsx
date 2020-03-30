import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import styled from 'styled-components';
import { ListItem, ListItemIcon } from '@material-ui/core';
import useBoolean from '../../hooks/useBoolean';
import Avatar from '../common/Avatar';
import { AvatarImageContainer } from '../common/Avatar.styled';

const StyledListItem = styled(ListItem)`
  && {
    background: #213a56;
    height: 5rem;
    min-height: 5rem;
    :focus {
      background-color: #213a56;
    }
    :hover {
      background-color: #213a56;
    }
  }
  &&.active {
    background-color: #213a56;
    :hover {
      background-color: #213a56;
    }
  }
`;

const DropdownListItem = styled(StyledListItem)`
  && {
    color: #c1ccda;
    height: 2.125rem;
    margin: 0;
    margin-bottom: 0.5rem;
    min-height: 2.125rem;
    text-transform: uppercase;
    transition: all 0.25s ease-out;

    :first-child {
      margin-top: 0.25rem;
    }

    :hover {
      background-color: #8492a4;
    }
  }
  &&.active {
    background-color: #8492a4;
    :hover {
      background-color: #8492a4;
    }
  }
`;

const DropdownBorder = styled.div`
  background-color: #c1ccda;
  height: 0.25rem;
  margin-bottom: -0.25rem;
  transform: translateY(-100%);
  width: 100%;
`;

const StyledDropdown = styled.div`
  background-color: #213a56;
  height: ${props => (props.open ? props.dropdownHeight : 0)}rem;
  min-height: ${props => (props.open ? props.dropdownHeight : 0)}rem;
  overflow: hidden;
  transition: all 0.25s ease-out;
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
        color: '#c1ccda',
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

const DrawerHeader = ({ setActiveId, user }) => {
  const userProfilePic = useSelector(state => state.userState.userProfilePic);
  const { access: userProfileAccess, orgUserRole } = useSelector(
    state => state.userState.userProfile || {},
  );

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const avatarInitials = user?.initials ?? '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  const onLinkClicked = useCallback(() => {
    closePopover();
    setActiveId('');
  }, [closePopover, setActiveId]);

  const userProfileEnabled = userProfileAccess?.userProfileEnabled;
  const linkComponent = userProfileEnabled ? StyledLink : undefined;

  const dropdownHeight = (isUserAdmin ? 4 : 2) * 2.625 + 0.5;

  return (
    <>
      <StyledListItem
        onMouseEnter={userProfileEnabled && openPopover}
        onMouseLeave={closePopover}
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
      </StyledListItem>
      <StyledDropdown
        open={isPopoverOpen}
        onMouseEnter={userProfileEnabled && openPopover}
        onMouseLeave={closePopover}
        timeout={250}
        dropdownHeight={dropdownHeight}
      >
        <DropdownListItem
          button
          onClick={onLinkClicked}
          component={linkComponent}
          link="/userProfile"
        >
          Profile & Settings
        </DropdownListItem>
        {isUserAdmin && (
          <>
            <DropdownListItem
              button
              onClick={onLinkClicked}
              component={linkComponent}
              link="/subscriptions"
            >
              Subscription & Users
            </DropdownListItem>
            <DropdownListItem
              button
              onClick={onLinkClicked}
              component={linkComponent}
              link="/billing"
            >
              Billing & Invoices
            </DropdownListItem>
          </>
        )}
        <DropdownListItem
          button
          onClick={onLinkClicked}
          component={linkComponent}
          link="/documents"
        >
          Documents & Agreements
        </DropdownListItem>
      </StyledDropdown>
      <DropdownBorder />
    </>
  );
};

export default DrawerHeader;
