import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import { getUserById, leaveOrganization, logout } from 'api/user-api';
import { openNotifications } from 'actions/template-actions';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'modal/actions';
import { showGlobalAlert as showGlobalAlertAction } from 'alert/actions';
import AlertTypes from 'alert/AlertTypes';

import AddButton from 'components/common/AddButton/AddButton';
import OrganizationIdentifier from 'components/org/OrganizationIdentifier/OrganizationIdentifier';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import Spacing from 'components/common/Spacing';

import {
  DrawerOrganizationsList,
  MyOrganizationLabel,
  RolloverPopover,
  RolloverPopoverLabel,
  SpacingContainer,
  SubmenuHeader,
  SubmenuDivider,
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const GUEST_ROLE = 'GUEST';

const OrganizationSubmenu = ({
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

  const handleLeaveOrganiztion = useCallback(() => {
    dispatch(
      openModalAction('LeaveOrganization', {
        confirm: () => {
          leaveOrganization(currentUser?.organizationIdentifier)
            .then(() => {
              logout(history);
            })
            .catch(() => {
              dispatch(closeModalAction());
              dispatch(
                showGlobalAlertAction(
                  'Something went wrong!',
                  AlertTypes.ERROR,
                ),
              );
            });
        },
      }),
    );
  }, [currentUser, dispatch, history]);

  const handleEditOrganization = useCallback(() => {
    dispatch(
      openModalAction('EditOrganization', {
        userProfile: currentUser,
        onSuccess: getUserById,
      }),
    );
  }, [currentUser, dispatch]);

  return (
    <>
      <Grid container justify="space-between" alignItems="center">
        <MyOrganizationLabel>
          {currentOrganization?.organizationName}
        </MyOrganizationLabel>
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
              onClick: handleEditOrganization,
            },
            GUEST_ROLE === orgUserRole && {
              key: 'leave_org',
              label: 'Leave Organization',
              onClick: handleLeaveOrganiztion,
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
      </Grid>
      <Grid container justify="space-between" alignItems="center">
        <SubmenuHeader>My Organizations </SubmenuHeader>
        <AddButton onClick={() => history.push('/onboarding/new-organization')}>
          Add
        </AddButton>
      </Grid>
      <SubmenuDivider />
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

export default OrganizationSubmenu;
