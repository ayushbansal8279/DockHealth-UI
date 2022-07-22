import React from 'react';
import { useSelector } from 'react-redux';
import { isNavbarVisibleSelector } from 'selectors/template-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import Intercom from 'react-intercom';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import NavigationSidebar from 'components/navigation/NavigationSidebar/NavigationSidebar';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import {
  DrawerContainer,
  MainContainer,
  useDrawerClasses,
  MaterialDrawer,
  SendBirdThemeColorSet,
} from './styled';

const { INTERCOM_APP_CODE } = process.env;

const NavigationTemplate = ({ children }) => {
  const currentUser = useSelector(userProfileSelector);
  const isNavbarVisible = useSelector(isNavbarVisibleSelector);

  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';
  const { identifier, name } = currentUser;

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

  return (
    <SendbirdProvider
      appId={appId}
      userId={identifier}
      nickname={name}
      colorSet={SendBirdThemeColorSet}
    >
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
          {intercomUser && intercomUser.name && (
            <Intercom appID={INTERCOM_APP_CODE} {...intercomUser} />
          )}
        </MainContainer>
      </DrawerContainer>
    </SendbirdProvider>
  );
};

export default NavigationTemplate;
