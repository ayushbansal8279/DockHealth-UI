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
import {
  DrawerContainer,
  MainContainer,
  useDrawerClasses,
  MaterialDrawer,
} from './styled';

const { INTERCOM_APP_CODE } = process.env;

const NavigationTemplate = ({ children }) => {
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const isNavbarVisible = useSelector(isNavbarVisibleSelector);

  const drawerClasses = useDrawerClasses({
    isNavbarVisible,
  });

  const intercomUser =
    currentUser.email && currentUser.firstName
      ? {
          email: currentUser.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        }
      : undefined;

  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;

  return (
    <DrawerContainer>
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
      <MainContainer>
        <GlobalAlertChip />
        {children}
        {intercomUser && intercomUser.name && !whiteLabelEnabled && (
          <Intercom appID={INTERCOM_APP_CODE} {...intercomUser} />
        )}
      </MainContainer>
    </DrawerContainer>
  );
};

export default NavigationTemplate;
