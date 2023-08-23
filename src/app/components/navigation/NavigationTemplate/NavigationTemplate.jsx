import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isNavbarVisibleSelector } from 'selectors/template-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { useIntercom } from 'react-use-intercom';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import NavigationSidebar from 'components/navigation/NavigationSidebar/NavigationSidebar';
import { useHistory } from 'react-router-dom';
import { DrawerContainer, MainContainer, MaterialDrawer } from './styled';

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

  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;

  const { boot, shutdown } = useIntercom();
  boot(
    currentUser.email && currentUser.firstName
      ? {
          email: currentUser?.email,
          name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        }
      : {},
  );

  const history = useHistory();
  const { location } = history;
  const { pathname } = location;
  const isPatientView = pathname.includes('/core/patient');
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;
  const embeddedModePatientView = isPatientView && embeddedMode;

  useEffect(() => {
    if (whiteLabelEnabled) {
      shutdown();
    }
  }, [shutdown, whiteLabelEnabled]);

  return (
    <DrawerContainer>
      {!embeddedModePatientView && (
        <MaterialDrawer
          $isNavbarVisible={isNavbarVisible}
          $navBackgroundColor={navBackgroundColorItem?.value}
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
      </MainContainer>
    </DrawerContainer>
  );
};

export default NavigationTemplate;
