/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import { ClickAwayListener, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  TASK_TEMPLATES_PATH,
  USERS_PATH,
  SUBS_SETTINGS_PATH,
  USERS_SETTINGS_PATH,
} from 'routing/helpers/paths';
import Spacing from 'components/common/Spacing.tsx';
import { UserOrganizationRole } from 'helpers/user-helper';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { subMenuKeySelector } from 'selectors/template-selectors';
import * as TemplateActions from 'actions/template-actions';
import SearchIcon from 'img/navigation/SearchIcon';
import HomeIcon from 'img/navigation/HomeIcon';
import ListsIcon from 'img/navigation/ListsIcon';
import PeopleIcon from 'img/navigation/PeopleIcon';
import PatientsIcon from 'img/navigation/PatientsIcon';
import SettingsIcon from 'img/navigation/SettingsIcon';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import EducationCenterIcon from 'img/navigation/EducationCenterIcon';
import DockcoinIconImage from 'img/navigation/dock-coin-icon.svg';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import OrganizationTile from 'components/org/OrganizationTile/OrganizationTile';
import { openModal } from 'modal/actions';
import OrganizationSubmenu from './SubMenuComponents/OrganizationSubmenu';
import ProfileSubmenu from './SubMenuComponents/ProfileSubmenu';
import EducationCenterSubmenu from './SubMenuComponents/EducationCenterSubmenu';
import SettingsSubmenu from './SubMenuComponents/SettingsSubmenu';
import ListsSubmenu from './SubMenuComponents/ListsSubmenu';
import PatientsSubmenu from './SubMenuComponents/PatientsSubmenu';
import UserGroupsSubmenu from './SubMenuComponents/UserGroupsSubmenu';
import menuTourHooks from './menu-tour-hooks';
import {
  DrawerContentContainer,
  MainMenuContainer,
  SubMenuContainer,
  DockcoinIcon,
  BarChartIcon,
} from './styled';
import IconNavigationItem from './IconNavigationItem';
import NavigationItem from './NavigationItem';

export const SubmenuKey = {
  ORGANIZATION: 'ORGANIZATION',
  PROFILE: 'PROFILE',
  LISTS: 'LISTS',
  PATIENTS: 'PATIENTS',
  USER_GROUPS: 'USER_GROUPS',
  SETTINGS: 'SETTINGS',
  EDUCATION_CENTER: 'EDUCATION_CENTER',
  DOCKCOIN: 'DOCKCOIN',
};

const SubmenuComponents = {
  [SubmenuKey.ORGANIZATION]: OrganizationSubmenu,
  [SubmenuKey.PROFILE]: ProfileSubmenu,
  [SubmenuKey.LISTS]: ListsSubmenu,
  [SubmenuKey.USER_GROUPS]: UserGroupsSubmenu,
  [SubmenuKey.PATIENTS]: PatientsSubmenu,
  [SubmenuKey.SETTINGS]: SettingsSubmenu,
  [SubmenuKey.EDUCATION_CENTER]: EducationCenterSubmenu,
};

const NavigationSidebar = ({
  currentUser,
  currentOrganization,
  selectCurrentOrganization,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const openedSubMenuKey = useSelector(subMenuKeySelector);

  const { orgUserRole } = currentUser || {};
  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);
  const isGuest = orgUserRole === UserOrganizationRole.GUEST;

  const {
    orgMenuReference,
    settingsMenuReference,
    profileMenuReference,
    renderMenuTourPopover,
  } = menuTourHooks({
    menuDrawerOpen: null,
    hideTour: false,
    isUserAdmin,
  });

  const SubMenuComponent = openedSubMenuKey
    ? SubmenuComponents[openedSubMenuKey]
    : null;

  const { organizationProfileColor, organizationInitials } =
    currentOrganization || {};

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  useEffect(() => {
    const unlisten = history.listen(() =>
      dispatch(TemplateActions.hideSubMenu()),
    );

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeSubMenu = useCallback(() => {
    if (openedSubMenuKey) dispatch(TemplateActions.hideSubMenu());
  }, [dispatch, openedSubMenuKey]);

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

  const handleReferClick = () => {
    dispatch(TemplateActions.hideSubMenu());
    dispatch(openModal('ReferAColleague'));
  };

  return (
    <ClickAwayListener onClickAway={closeSubMenu}>
      <DrawerContentContainer isOpen={!!SubMenuComponent}>
        <MainMenuContainer>
          <Grid container direction="column">
            <div ref={orgMenuReference}>
              <NavigationItem
                name="Organization"
                subMenuKey={SubmenuKey.ORGANIZATION}
                subMenuOpen={openedSubMenuKey === SubmenuKey.ORGANIZATION}
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
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="Lists"
              subMenuKey={SubmenuKey.LISTS}
              icon={ListsIcon}
              subMenuOpen={openedSubMenuKey === SubmenuKey.LISTS}
              path="/core/tasks"
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name="People"
              icon={PeopleIcon}
              subMenuKey={SubmenuKey.USER_GROUPS}
              subMenuOpen={openedSubMenuKey === SubmenuKey.PEOPLE}
              path={USERS_PATH}
              onItemClick={handleNavigationItemClick}
            />
            <IconNavigationItem
              name={`${customerTypeLabelCapitalized}s`}
              icon={PatientsIcon}
              subMenuKey={SubmenuKey.PATIENTS}
              subMenuOpen={openedSubMenuKey === SubmenuKey.PATIENTS}
              path="/core/patients"
              onItemClick={handleNavigationItemClick}
            />
            {!isGuest && (
              <IconNavigationItem
                name="Workflow Library"
                icon={TemplatesIcon}
                path={TASK_TEMPLATES_PATH}
                onItemClick={handleNavigationItemClick}
              />
            )}
            <IconNavigationItem
              name="Education Center"
              icon={EducationCenterIcon}
              subMenuKey={SubmenuKey.EDUCATION_CENTER}
              subMenuOpen={openedSubMenuKey === SubmenuKey.EDUCATION_CENTER}
              onItemClick={handleNavigationItemClick}
            />
            {!isGuest && (
              <IconNavigationItem
                name="Analytics"
                icon={BarChartIcon}
                path="/core/analytics"
                onItemClick={handleNavigationItemClick}
                isNew
              />
            )}
          </Grid>
          <Grid container direction="column">
            {isUserAdmin && (
              <div ref={settingsMenuReference}>
                <IconNavigationItem
                  name="Admin"
                  subMenuKey={SubmenuKey.SETTINGS}
                  icon={SettingsIcon}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.SETTINGS}
                  path={[
                    '/settings/billing',
                    SUBS_SETTINGS_PATH,
                    USERS_SETTINGS_PATH,
                  ]}
                  onItemClick={handleNavigationItemClick}
                />
              </div>
            )}
            <NavigationItem
              name="Dockcoin"
              subMenuKey={SubmenuKey.DOCKCOIN}
              onItemClick={handleReferClick}
            >
              <>
                <DockcoinIcon src={DockcoinIconImage} />
              </>
            </NavigationItem>
            <div ref={profileMenuReference}>
              <NavigationItem
                name="Account"
                subMenuKey={SubmenuKey.PROFILE}
                subMenuOpen={openedSubMenuKey === SubmenuKey.PROFILE}
                onItemClick={handleNavigationItemClick}
              >
                <>
                  <Spacing vertical={3} />
                  <UserAvatar hideTooltip user={currentUser} size={40} />
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

export default NavigationSidebar;
