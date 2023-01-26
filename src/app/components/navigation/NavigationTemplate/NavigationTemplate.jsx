import React from 'react';
import { useSelector } from 'react-redux';
import { isNavbarVisibleSelector } from 'selectors/template-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import Intercom from 'react-intercom';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import NavigationSidebar from 'components/navigation/NavigationSidebar/NavigationSidebar';
import { useHistory } from 'react-router-dom';
import {
  DrawerContainer,
  MainContainer,
  useDrawerClasses,
  MaterialDrawer,
} from './styled';

const { INTERCOM_APP_CODE } = import.meta.env;

const NavigationTemplate = ({ children }) => {
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const isNavbarVisible = useSelector(isNavbarVisibleSelector);

  const navBackgroundColorItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'navigation.menu.backgroundColor',
    ) || {};
  const globalAlertBackgroundColorItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'global.alert.backgroundColor',
    ) || {};

  const drawerClasses = useDrawerClasses({
    isNavbarVisible,
    navBackgroundColor: navBackgroundColorItem?.value,
  });

  const intercomUser =
    currentUser.email && currentUser.firstName
      ? {
          email: currentUser.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        }
      : undefined;

  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;

  const history = useHistory();
  const { location } = history;
  const { pathname } = location;
  const isPatientView = pathname.includes('/core/patient');
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;
  const embeddedModePatientView = isPatientView && embeddedMode;

  return (
    <DrawerContainer>
      {!embeddedModePatientView && (
        <MaterialDrawer
          classes={{
            root: drawerClasses.drawer,
            paper: drawerClasses.drawerPaper,
          }}
          variant="permanent"
          anchor="left"
        >
          <NavigationSidebar />
        </MaterialDrawer>
      )}
      <MainContainer>
        <GlobalAlertChip
          backgroundColor={globalAlertBackgroundColorItem?.value}
        />
        {children}
        {intercomUser && intercomUser.name && !whiteLabelEnabled && (
          <Intercom appID={INTERCOM_APP_CODE} {...intercomUser} />
        )}
      </MainContainer>
    </DrawerContainer>
  );
};

export default NavigationTemplate;
