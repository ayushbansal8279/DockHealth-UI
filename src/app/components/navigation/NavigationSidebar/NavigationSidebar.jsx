/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import { ClickAwayListener, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  WORKFLOW_LIBRARY_PATH,
  // USERS_PATH,
  SUBS_SETTINGS_PATH,
  USERS_SETTINGS_PATH,
  CUSTOM_PROFILES_PATH,
} from 'routing/helpers/paths';
import Spacing from 'components/common/Spacing';
import {
  userProfileSelector,
  userHasDockChatFeatureSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  showChatPopoverSelector,
  selectedChatChannelSelector,
} from 'selectors/sendbird-selectors';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { selectCurrentOrganization } from 'api/organization-api';
import { subMenuKeySelector } from 'selectors/template-selectors';
import * as TemplateActions from 'actions/template-actions';
import SearchIcon from 'img/navigation/SearchIcon';
import HomeIcon from 'img/navigation/HomeIcon';
import ListsIcon from 'img/navigation/ListsIcon';
import ProfilesIcon from 'img/navigation/ProfilesIcon';
import PatientsIcon from 'img/navigation/PatientsIcon';
import SettingsIcon from 'img/navigation/SettingsIcon';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import EducationCenterIcon from 'img/navigation/EducationCenterIcon';
// import DockcoinIconImage from 'img/navigation/dock-coin-icon.svg';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import OrganizationTile from 'components/org/OrganizationTile/OrganizationTile';
// import { openModal } from 'modal/actions';
import AccessRestrictor, {
  CAN_ACCESS_ANALYTICS_PAGE,
  CAN_ACCESS_CHAT_PAGE,
  CAN_ACCESS_EDUCATION_CENTER_PAGE,
  CAN_ACCESS_HOME_PAGE,
  CAN_ACCESS_MEMBER_LIST_PAGE,
  // CAN_ACCESS_PEOPLE_LIST_PAGE,
  CAN_ACCESS_SEARCH_PAGE,
  CAN_ACCESS_SETTINGS_PAGE,
  CAN_ACCESS_TASK_LIST_PAGE,
  CAN_ACCESS_WORKFLOW_LIST_PAGE,
} from 'components/access/AccessRestrictor/AccessRestrictor';
import ChatPopover from 'views/chat/ChatPopover';
import ChatIcon from 'views/chat/Icons/ChatIcon';
import { openPopover } from 'actions/sendbird-actions';
import OrganizationSubmenu from './SubMenuComponents/OrganizationSubmenu';
import ProfileSubmenu from './SubMenuComponents/ProfileSubmenu';
import CustomProfilesSubmenu from './SubMenuComponents/CustomProfilesSubmenu';
import EducationCenterSubmenu from './SubMenuComponents/EducationCenterSubmenu';
import SettingsSubmenu from './SubMenuComponents/SettingsSubmenu';
import ListsSubmenu from './SubMenuComponents/ListsSubmenu';
import PatientsSubmenu from './SubMenuComponents/PatientsSubmenu';
import UserGroupsSubmenu from './SubMenuComponents/UserGroupsSubmenu';
import menuTourHooks from './menu-tour-hooks';
import IconNavigationItem from './IconNavigationItem';
import NavigationItem from './NavigationItem';
import {
  DrawerContentContainer,
  MainMenuContainer,
  SubMenuContainer,
  // DockcoinIcon,
  NavigationIconContainer,
  BarChartIcon,
} from './styled';

export const SubmenuKey = {
  ORGANIZATION: 'ORGANIZATION',
  PROFILE: 'PROFILE',
  LISTS: 'LISTS',
  CUSTOM_PROFILES: 'CUSTOM_PROFILES',
  PATIENTS: 'PATIENTS',
  USER_GROUPS: 'USER_GROUPS',
  SETTINGS: 'SETTINGS',
  EDUCATION_CENTER: 'EDUCATION_CENTER',
  DOCKCOIN: 'DOCKCOIN',
  DOCKCHAT: 'DOCKCHAT',
};

const SubmenuComponents = {
  [SubmenuKey.ORGANIZATION]: OrganizationSubmenu,
  [SubmenuKey.PROFILE]: ProfileSubmenu,
  [SubmenuKey.LISTS]: ListsSubmenu,
  [SubmenuKey.CUSTOM_PROFILES]: CustomProfilesSubmenu,
  [SubmenuKey.USER_GROUPS]: UserGroupsSubmenu,
  [SubmenuKey.PATIENTS]: PatientsSubmenu,
  [SubmenuKey.SETTINGS]: SettingsSubmenu,
  [SubmenuKey.EDUCATION_CENTER]: EducationCenterSubmenu,
};

const NavigationSidebar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const showChatPopover = useSelector(showChatPopoverSelector);
  const openedSubMenuKey = useSelector(subMenuKeySelector);
  const selectedChannel = useSelector(selectedChatChannelSelector);

  const { orgUserRole } = currentUser || {};
  const isUserAdmin = ['ADMIN', 'OWNER'].includes(orgUserRole);

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const dockChatAvailable = useSelector(userHasDockChatFeatureSelector);
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

  const { organizationProfileColor, organizationInitials } =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  const {
    orgMenuReference,
    settingsMenuReference,
    profileMenuReference,
    renderMenuTourPopover,
  } = menuTourHooks({
    menuDrawerOpen: null,
    hideTour: true,
    isUserAdmin,
  });

  const SubMenuComponent = openedSubMenuKey
    ? SubmenuComponents[openedSubMenuKey]
    : null;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;
  const navSelectedColorItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'navigation.menu.selectedColor',
    ) || {};

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

  const handleDockChatClick = useCallback(() => {
    if (location.pathname !== '/core/chat') {
      dispatch(openPopover(selectedChannel ?? null));
      dispatch(TemplateActions.hideSubMenu());
    }
  }, [dispatch, location.pathname, selectedChannel]);

  const handleEducationCenterClick = useCallback(() => {
    window.open('https://help.dock.health', '_blank');
  }, []);

  // const handleReferClick = () => {
  //   dispatch(TemplateActions.hideSubMenu());
  //   dispatch(openModal('ReferAColleague'));
  // };

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
            <AccessRestrictor required={[CAN_ACCESS_SEARCH_PAGE]}>
              <IconNavigationItem
                name="Search"
                icon={SearchIcon}
                path="/core/search"
                onItemClick={handleNavigationItemClick}
                navSelectedColor={navSelectedColorItem?.value}
              />
            </AccessRestrictor>
            <AccessRestrictor required={[CAN_ACCESS_HOME_PAGE]}>
              <IconNavigationItem
                name="Home"
                icon={HomeIcon}
                path="/core/home"
                onItemClick={handleNavigationItemClick}
                navSelectedColor={navSelectedColorItem?.value}
              />
            </AccessRestrictor>
            <AccessRestrictor required={[CAN_ACCESS_TASK_LIST_PAGE]}>
              <IconNavigationItem
                name="Lists"
                subMenuKey={SubmenuKey.LISTS}
                icon={ListsIcon}
                subMenuOpen={openedSubMenuKey === SubmenuKey.LISTS}
                path="/core/tasks"
                onItemClick={handleNavigationItemClick}
                navSelectedColor={navSelectedColorItem?.value}
              />
            </AccessRestrictor>
            {!embeddedMode && (
              <AccessRestrictor>
                <IconNavigationItem
                  name="Profiles"
                  icon={ProfilesIcon}
                  path={CUSTOM_PROFILES_PATH}
                  subMenuKey={SubmenuKey.CUSTOM_PROFILES}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.CUSTOM_PROFILES}
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )}
            {/* {!embeddedMode && (
              <AccessRestrictor required={[CAN_ACCESS_PEOPLE_LIST_PAGE]}>
                <IconNavigationItem
                  name="People"
                  icon={PeopleIcon}
                  subMenuKey={SubmenuKey.USER_GROUPS}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.PEOPLE}
                  path={USERS_PATH}
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )} */}
            {!embeddedMode && (
              <AccessRestrictor required={[CAN_ACCESS_MEMBER_LIST_PAGE]}>
                <IconNavigationItem
                  name={`${customerTypeLabelCapitalized}s`}
                  icon={PatientsIcon}
                  subMenuKey={SubmenuKey.PATIENTS}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.PATIENTS}
                  path="/core/patients"
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )}
            {!embeddedMode && (
              <AccessRestrictor required={[CAN_ACCESS_WORKFLOW_LIST_PAGE]}>
                <IconNavigationItem
                  name="Workflow Library"
                  icon={TemplatesIcon}
                  path={WORKFLOW_LIBRARY_PATH}
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )}
            {!embeddedMode && (
              <AccessRestrictor required={[CAN_ACCESS_ANALYTICS_PAGE]}>
                <IconNavigationItem
                  name="Analytics"
                  icon={BarChartIcon}
                  path="/core/analytics"
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )}
            {dockChatAvailable && (
              <AccessRestrictor required={[CAN_ACCESS_CHAT_PAGE]}>
                <NavigationIconContainer>
                  <IconNavigationItem
                    name="Dock Chat"
                    icon={() => {
                      return <ChatIcon />;
                    }}
                    path=""
                    onItemClick={handleDockChatClick}
                    navSelectedColor={navSelectedColorItem?.value}
                    isNew
                  />
                </NavigationIconContainer>
              </AccessRestrictor>
            )}
          </Grid>
          <Grid container direction="column">
            <AccessRestrictor required={[CAN_ACCESS_SETTINGS_PAGE]}>
              <div ref={settingsMenuReference}>
                <IconNavigationItem
                  name="Settings"
                  subMenuKey={SubmenuKey.SETTINGS}
                  icon={SettingsIcon}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.SETTINGS}
                  path={[
                    '/settings/billing',
                    SUBS_SETTINGS_PATH,
                    USERS_SETTINGS_PATH,
                  ]}
                  onItemClick={handleNavigationItemClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </div>
            </AccessRestrictor>
            {!whiteLabelEnabled && (
              <AccessRestrictor required={[CAN_ACCESS_EDUCATION_CENTER_PAGE]}>
                <IconNavigationItem
                  name="Education Center"
                  icon={EducationCenterIcon}
                  subMenuKey={SubmenuKey.EDUCATION_CENTER}
                  subMenuOpen={openedSubMenuKey === SubmenuKey.EDUCATION_CENTER}
                  onItemClick={handleEducationCenterClick}
                  navSelectedColor={navSelectedColorItem?.value}
                />
              </AccessRestrictor>
            )}
            {/* <AccessRestrictor
              allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, EXTERNAL]}
            >
              <NavigationItem
                name="Dock Coin"
                subMenuKey={SubmenuKey.DOCKCOIN}
                onItemClick={handleReferClick}
              >
                <>
                  <DockcoinIcon src={DockcoinIconImage} />
                </>
              </NavigationItem>
            </AccessRestrictor> */}
            <div ref={profileMenuReference}>
              <NavigationItem
                name="Account"
                subMenuKey={SubmenuKey.PROFILE}
                subMenuOpen={openedSubMenuKey === SubmenuKey.PROFILE}
                onItemClick={handleNavigationItemClick}
                navSelectedColor={navSelectedColorItem?.value}
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
        {showChatPopover && <ChatPopover />}
      </DrawerContentContainer>
    </ClickAwayListener>
  );
};

export default NavigationSidebar;
