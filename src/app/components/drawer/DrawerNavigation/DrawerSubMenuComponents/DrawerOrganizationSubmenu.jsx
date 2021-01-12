import React, { useMemo, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import { openNotifications } from 'actions/template-actions';
import OrganizationIdentifier from 'components/Organization/OrganizationIdentifier/OrganizationIdentifier';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import Spacing from 'components/common/Spacing';

import {
  DrawerOrganizationHeader,
  DrawerOrganizationLabel,
  DrawerOrganizationsList,
  DrawerMyOrganizationLabel,
  DrawerAddLink,
  RolloverPopover,
  RolloverPopoverLabel,
  SpacingContainer,
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const GUEST_ROLE = 'GUEST';

const DrawerOrganizationSubmenu = ({
  currentUser = {},
  selectCurrentOrganization,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userOrganizations = useSelector(userOrganizationsSelector);
  const { orgUserRole } = currentUser;
  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);
  const [orgMenuPopupOpen, setOrgMenuPopupOpen] = useState(false);
  const currentOrgMenuPopupReference = useRef(null);

  const currentOrganization = useMemo(
    () =>
      userOrganizations?.find(
        ({ organizationIdentifier }) =>
          currentOrganizationIdentifier === organizationIdentifier,
      ),
    [userOrganizations, currentOrganizationIdentifier],
  );

  const availableUserOrganizations = useMemo(
    () =>
      userOrganizations?.filter(
        ({ organizationIdentifier }) =>
          organizationIdentifier !== currentOrganizationIdentifier,
      ),
    [userOrganizations, currentOrganizationIdentifier],
  );

  const handleMouseEnter = (event, listName) => {
    const { target } = event;

    if (target?.scrollWidth > target?.offsetWidth) {
      hoveredItemReference.current = target;
      setPopoverLabel(listName);
    }
  };

  return (
    <>
      <DrawerOrganizationHeader>
        <DrawerOrganizationLabel>
          {currentOrganization?.organizationName}
        </DrawerOrganizationLabel>
        <IconButton
          ref={currentOrgMenuPopupReference}
          size="small"
          color="secondary"
          onClick={() => setOrgMenuPopupOpen(true)}
        >
          <MoreVert />
        </IconButton>
        <MenuPopover
          anchorEl={currentOrgMenuPopupReference?.current}
          open={orgMenuPopupOpen}
          onClose={() => setOrgMenuPopupOpen(false)}
          onAfterOptionClick={() => setOrgMenuPopupOpen(false)}
          itemType="secondary"
          options={[
            MASTER_ROLES.includes(orgUserRole) && {
              key: 'edit_org',
              label: 'Edit Organization',
              onClick: () =>
                history.push('/settings/userProfile/edit-organization'),
            },
            GUEST_ROLE === orgUserRole && {
              key: 'leave_org',
              label: 'Leave Organization',
              onClick: () =>
                history.push('/settings/userProfile/leave-organization'),
            },
            MASTER_ROLES.includes(orgUserRole) && {
              key: 'manage_users',
              label: 'Manage Users',
              onClick: () => history.push('/settings/subscriptions'),
            },
            {
              key: 'notifications',
              label: 'Notifications',
              onClick: () => dispatch(openNotifications('SETTINGS')),
            },
          ]}
        />
      </DrawerOrganizationHeader>
      <DrawerMyOrganizationLabel>
        <div>My Organizations </div>
        <DrawerAddLink to="/onboarding/new-organization">
          <span>+</span> Add
        </DrawerAddLink>
      </DrawerMyOrganizationLabel>
      <DrawerOrganizationsList>
        {availableUserOrganizations?.map(org => (
          <>
            <OrganizationIdentifier
              isOpen
              tileConfig={{
                fontSize: 'smallPlus',
                ...org,
              }}
              key={`org_${org?.organizationIdentifier}`}
              identifierConfig={{ fontColor: '#8492a4' }}
              organizationName={org?.organizationName}
              onSelect={() =>
                selectCurrentOrganization(org?.organizationIdentifier)
              }
              onMouseEnterName={event =>
                handleMouseEnter(event, org?.organizationName)
              }
              onMouseLeaveName={() => setPopoverLabel(null)}
            />
            <SpacingContainer>
              <Spacing vertical={4} />
              <Spacing vertical={2} />
            </SpacingContainer>
          </>
        ))}
        <RolloverPopover
          anchorEl={hoveredItemReference?.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={!!popoverLabel}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transitionDuration={100}
        >
          <RolloverPopoverLabel>{popoverLabel}</RolloverPopoverLabel>
        </RolloverPopover>
      </DrawerOrganizationsList>
    </>
  );
};

export default DrawerOrganizationSubmenu;
