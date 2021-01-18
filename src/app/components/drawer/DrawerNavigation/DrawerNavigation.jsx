import React, { useCallback, useEffect } from 'react';
import { ClickAwayListener, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Spacing from 'components/common/Spacing';
import { subMenuKeySelector } from 'selectors/template-selectors';
import * as TemplateActions from 'actions/template-actions';
import SearchIcon from 'img/drawer/SearchIcon';
import HomeIcon from 'img/drawer/HomeIcon';
import ListsIcon from 'img/drawer/ListsIcon';
import PeopleIcon from 'img/drawer/PeopleIcon';
import PatientsIcon from 'img/drawer/PatientsIcon';
import SettingsIcon from 'img/drawer/SettingsIcon';
import Member from 'components/members/Member/Member';
import OrganizationTile from 'components/Organization/OrganizationTile/OrganizationTile';
import DrawerOrganizationSubmenu from './DrawerSubMenuComponents/DrawerOrganizationSubmenu';
import DrawerProfileSubmenu from './DrawerSubMenuComponents/DrawerProfileSubmenu';
import DrawerSettingsSubmenu from './DrawerSubMenuComponents/DrawerSettingsSubmenu';
import DrawerListsSubmenu from './DrawerSubMenuComponents/DrawerListsSubmenu';
import MenuTourHooks from './DrawerNavigation.MenuTourHooks';

import {
  DrawerContentContainer,
  MainMenuContainer,
  SubMenuContainer,
} from './styled';
import IconNavigationItem from './IconNavigationItem';
import NavigationItem from './NavigationItem';

const ORGANIZATION_SUBMENU_KEY = 'ORGANIZATION';
const PROFILE_SUBMENU_KEY = 'PROFILE';
export const LISTS_SUBMENU_KEY = 'LISTS';
const SETTINGS_SUBMENU_KEY = 'SETTINGS';

const SUBMENU_COMPONENTS = {
  [ORGANIZATION_SUBMENU_KEY]: DrawerOrganizationSubmenu,
  [PROFILE_SUBMENU_KEY]: DrawerProfileSubmenu,
  [LISTS_SUBMENU_KEY]: DrawerListsSubmenu,
  [SETTINGS_SUBMENU_KEY]: DrawerSettingsSubmenu,
};

const DrawerNavigation = ({
  currentUser,
  currentOrganization,
  selectCurrentOrganization,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const openedSubMenuKey = useSelector(subMenuKeySelector);

  const { orgUserRole } = currentUser || {};
  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const {
    orgMenuReference,
    settingsMenuReference,
    profileMenuReference,
    renderMenuTourPopover,
  } = MenuTourHooks({
    menuDrawerOpen: null,
    hideTour: false,
  });

  const SubMenuComponent = openedSubMenuKey
    ? SUBMENU_COMPONENTS[openedSubMenuKey]
    : null;

  const { organizationProfileColor, organizationInitials } =
    currentOrganization || {};

  useEffect(() => {
    const unlisten = history.listen(() => {
      dispatch(TemplateActions.hideSubMenu());
    });

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeSubMenu = useCallback(
    () => dispatch(TemplateActions.hideSubMenu()),
    [dispatch],
  );

  const handleNavigationItemClick = useCallback(
    (subMenuKey, path) => {
      if (subMenuKey) {
        if (subMenuKey === openedSubMenuKey) {
          closeSubMenu();
        } else {
          dispatch(TemplateActions.showSubMenu(subMenuKey));
        }
      } else {
        history.push(path);
      }
    },
    [dispatch, history, openedSubMenuKey, closeSubMenu],
  );

  return (
    <ClickAwayListener onClickAway={closeSubMenu}>
      <DrawerContentContainer isOpen={!!SubMenuComponent}>
        <MainMenuContainer>
          <Grid container direction="column">
            <div ref={orgMenuReference}>
              <NavigationItem
                name="Organization"
                subMenuKey={ORGANIZATION_SUBMENU_KEY}
                subMenuOpen={openedSubMenuKey === ORGANIZATION_SUBMENU_KEY}
                onItemClick={handleNavigationItemClick}
              >
                <>
                  <Spacing vertical={3} />
                  <OrganizationTile
                    size={40}
                    organizationProfileColor={organizationProfileColor}
                    organizationInitials={organizationInitials}
                  />
                  <Spacing vertical={3} />
                </>
              </NavigationItem>
            </div>
            <IconNavigationItem
              name="Search"
              icon={SearchIcon}
              path="/core/search"
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="Home"
              icon={HomeIcon}
              path="/core/home"
              strokeIcon
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="Lists"
              subMenuKey={LISTS_SUBMENU_KEY}
              icon={ListsIcon}
              subMenuOpen={openedSubMenuKey === LISTS_SUBMENU_KEY}
              path="/core/tasks"
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="People"
              icon={PeopleIcon}
              path="/core/people"
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="Patients"
              icon={PatientsIcon}
              path="/core/patients"
              onItemClick={handleNavigationItemClick}
            />
          </Grid>
          <Grid container direction="column">
            {isUserAdmin && (
              <div ref={settingsMenuReference}>
                <IconNavigationItem
                  name="Admin"
                  subMenuKey={SETTINGS_SUBMENU_KEY}
                  icon={SettingsIcon}
                  subMenuOpen={openedSubMenuKey === SETTINGS_SUBMENU_KEY}
                  path={['/settings/billing', '/settings/subscriptions']}
                  onItemClick={handleNavigationItemClick}
                />
              </div>
            )}
            <div ref={profileMenuReference}>
              <NavigationItem
                name="Account"
                subMenuKey={PROFILE_SUBMENU_KEY}
                subMenuOpen={openedSubMenuKey === PROFILE_SUBMENU_KEY}
                onItemClick={handleNavigationItemClick}
              >
                <>
                  <Spacing vertical={3} />
                  <Member showTooltip={false} member={currentUser} size={40} />
                  <Spacing vertical={3} />
                </>
              </NavigationItem>
            </div>
          </Grid>
        </MainMenuContainer>
        <SubMenuContainer>
          {SubMenuComponent && (
            <SubMenuComponent
              currentUser={currentUser}
              selectCurrentOrganization={selectCurrentOrganization}
            />
          )}
        </SubMenuContainer>
        {renderMenuTourPopover()}
      </DrawerContentContainer>
    </ClickAwayListener>
  );
};

export default DrawerNavigation;
