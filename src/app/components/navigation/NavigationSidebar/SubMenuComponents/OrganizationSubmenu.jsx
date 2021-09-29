import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import { logout } from 'api/user-auth-api';
import { leaveOrganization } from 'api/organization-api';
import { openNotifications } from 'actions/template-actions';
import { getCurrentUserOrganizations } from 'actions/user-actions';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'modal/actions';
import { showGlobalAlert as showGlobalAlertAction } from 'alert/actions';
import AlertTypes from 'alert/AlertTypes';

import AddButton from 'components/common/AddButton/AddButton';
import OrganizationIdentifier from 'components/org/OrganizationIdentifier/OrganizationIdentifier';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
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
        onSuccess: () => dispatch(getCurrentUserOrganizations()),
      }),
    );
  }, [currentUser, dispatch]);

  const menuOptions = useMemo(
    () => [
      MASTER_ROLES.includes(orgUserRole) && {
        name: 'Edit Organization',
        onClick: handleEditOrganization,
      },
      GUEST_ROLE === orgUserRole && {
        name: 'Leave Organization',
        onClick: handleLeaveOrganiztion,
      },
      MASTER_ROLES.includes(orgUserRole) && {
        name: 'Manage Users',
        onClick: () => history.push(SUBS_SETTINGS_PATH),
      },
      {
        name: 'Notifications',
        onClick: () => dispatch(openNotifications('SETTINGS')),
      },
    ],
    [
      dispatch,
      handleEditOrganization,
      handleLeaveOrganiztion,
      history,
      orgUserRole,
    ],
  );

  return (
    <>
      <Grid container justify="space-between" alignItems="center">
        <MyOrganizationLabel>
          {currentOrganization?.organizationName}
        </MyOrganizationLabel>
        <OptionsMenu customButtonComponent={IconButton} options={menuOptions}>
          <MoreVert />
        </OptionsMenu>
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
