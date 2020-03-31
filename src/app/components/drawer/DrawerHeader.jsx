import { ListItem, ListItemIcon } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import palette from '../../palette';
import Member from '../members/Member';

const StyledListItem = styled(ListItem)`
  && {
    background-color: ${palette.midnightBlue};
    height: 5rem;
    min-height: 5rem;
    padding: 0.75rem 1rem 1rem;
    :focus {
      background-color: ${palette.midnightBlue};
    }
    :hover {
      background-color: ${palette.midnightBlue};
    }
  }
  &&.active {
    background-color: ${palette.midnightBlue};
    :hover {
      background-color: ${palette.midnightBlue};
    }
  }
`;

const DropdownListItem = styled(StyledListItem)`
  && {
    color: ${palette.coolGrey2};
    height: 2.125rem;
    margin: 0;
    margin-bottom: 0.5rem;
    min-height: 2.125rem;
    padding: 0 1rem;
    text-transform: uppercase;
    transition: all 0.25s ease-out;

    :first-child {
      margin-top: 0.25rem;
    }

    :hover {
      background-color: ${palette.coolGrey1};
    }
  }
  &&.active {
    background-color: ${palette.coolGrey1};
    :hover {
      background-color: ${palette.coolGrey1};
    }
  }
`;

const DropdownBorder = styled.div`
  background-color: ${palette.coolGrey2};
  height: 0.25rem;
  margin-bottom: -0.25rem;
  transform: translateY(-100%);
  width: 100%;
`;

const StyledDropdown = styled.div`
  background-color: ${palette.midnightBlue};
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
        color: palette.coolGrey2,
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

const DrawerHeader = ({ onMouseEnter, setActiveId, user }) => {
  const { access: userProfileAccess, orgUserRole } = useSelector(
    state => state.userState.userProfile || {},
  );

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const onLinkClicked = useCallback(() => {
    closePopover();
    setActiveId('');
  }, [closePopover, setActiveId]);

  const userProfileEnabled = userProfileAccess?.userProfileEnabled;
  const linkComponent = userProfileEnabled ? StyledLink : undefined;

  const dropdownHeight = (isUserAdmin ? 4 : 2) * 2.625 + 0.25;

  const onDrawerHeaderOpen = useCallback(() => {
    openPopover();
    onMouseEnter();
  }, [onMouseEnter, openPopover]);

  return (
    <>
      <StyledListItem
        onMouseEnter={userProfileEnabled && onDrawerHeaderOpen}
        onMouseLeave={closePopover}
      >
        <ListItemIcon
          style={{
            marginLeft: '-2px',
          }}
        >
          <Member
            showTooltip={false}
            member={user}
            color={palette.midnightBlue}
          />
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
