import { ListItem, ListItemIcon } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import styled from 'styled-components';
import useBoolean from 'hooks/useBoolean';
import palette from 'app/palette';
import { getSubscriptionIsTrial } from 'views/self-serve/subscriptions/SubscriptionsView.Utilities';
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

const getListElements = ({ isUserAdmin, organization }) => {
  const isSubscriptionTrial = getSubscriptionIsTrial({
    subscription: organization?.subscriptionDetails,
  });

  return [
    {
      link: '/userProfile',
      label: 'Profile & Settings',
    },
    isUserAdmin && {
      link: '/subscriptions',
      label: 'Subscription & Users',
    },
    isUserAdmin &&
      !isSubscriptionTrial && {
        link: '/billing',
        label: 'Billing & Invoices',
      },
    {
      link: '/documents',
      label: 'Documents & Agreements',
    },
  ].filter(Boolean);
};

const renderListElement = ({ onLinkClicked, linkComponent }) => ({
  link,
  label,
}) => (
  <DropdownListItem
    key={link}
    button
    onClick={onLinkClicked}
    component={linkComponent}
    link={link}
  >
    {label}
  </DropdownListItem>
);

const DrawerHeader = ({ onMouseEnter, setActiveId, user }) => {
  const { access: userProfileAccess, orgUserRole } = useSelector(
    state => state.userState.userProfile || {},
  );

  const { organization } = useSelector(store => store.organizationState);

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const onLinkClicked = useCallback(() => {
    closePopover();
    setActiveId('');
  }, [closePopover, setActiveId]);

  const userProfileEnabled = userProfileAccess?.userProfileEnabled;
  const linkComponent = userProfileEnabled ? StyledLink : undefined;

  const onDrawerHeaderOpen = useCallback(() => {
    openPopover();
    onMouseEnter();
  }, [onMouseEnter, openPopover]);

  const listElements = useMemo(
    () => getListElements({ isUserAdmin, organization }),
    [isUserAdmin, organization],
  );

  const dropdownHeight = listElements.length * 2.625 + 0.25;

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
        {listElements.map(renderListElement({ onLinkClicked, linkComponent }))}
      </StyledDropdown>
      <DropdownBorder />
    </>
  );
};

export default DrawerHeader;
