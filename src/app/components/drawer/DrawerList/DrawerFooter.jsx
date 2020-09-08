import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import palette from 'styles/palette';
import { getSubscriptionIsTrial } from 'views/self-serve/subscriptions/SubscriptionsView.Utilities';
import Member from '../../members/Member/Member';
import {
  DrawerMemberContainer,
  ListDivider,
  DropdownListItem,
  StyledDropdown,
} from './styled';

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
      label: 'Profile',
    },
    isUserAdmin && {
      link: '/subscriptions',
      label: 'Subscriptions',
    },
    isUserAdmin &&
      !isSubscriptionTrial && {
        link: '/billing',
        label: 'Billing',
      },
    {
      link: '/documents',
      label: 'Agreements',
    },
    {
      link: '/logout',
      label: 'Logout',
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

const DrawerFooter = ({ setActiveId, user, settingsVisible = true }) => {
  const { access: userProfileAccess, orgUserRole } = useSelector(
    state => state.userState.userProfile || {},
  );

  const { organization } = useSelector(store => store.organizationState);

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const onLinkClicked = useCallback(() => {
    setActiveId('');
  }, [setActiveId]);

  const userProfileEnabled = userProfileAccess?.userProfileEnabled;
  const linkComponent = userProfileEnabled ? StyledLink : undefined;

  const listElements = useMemo(
    () => getListElements({ isUserAdmin, organization }),
    [isUserAdmin, organization],
  );

  return (
    <>
      <ListDivider />
      <DrawerMemberContainer>
        <Member showTooltip={false} member={user} size={40} />
      </DrawerMemberContainer>
      {settingsVisible && (
        <StyledDropdown>
          {listElements.map(
            renderListElement({ onLinkClicked, linkComponent }),
          )}
        </StyledDropdown>
      )}
    </>
  );
};

export default DrawerFooter;
