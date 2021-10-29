import { AppBar, Drawer as MaterialDrawer, Grid } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import Intercom from 'react-intercom';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import { MontserratTypography } from 'styles/theme-montserrat';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import NavigationSidebar from 'components/navigation/NavigationSidebar/NavigationSidebar';
import {
  initializeNavigationTemplateHooks,
  initializeNavigationHeaderHooks,
  initializeNavigationDrawerHooks,
} from './hooks';
import {
  ContentContainer,
  DrawerContainer,
  MainContainer,
  TrialBanner,
  TrialBannerContainer,
  TrialBannerLink,
} from './styled';

const { INTERCOM_APP_CODE } = process.env;

const renderHeaderColumn = ({ key, component, ...otherProps }) => (
  <Grid item container key={key} {...otherProps}>
    {component}
  </Grid>
);

const NavigationDrawer = ({
  bannerVisibleFlag,
  setBannerVisibleFlag,
  hasCreditCardExpirationMessage,
}) => {
  const {
    user,
    currentOrganization,
    selectCurrentOrganization,
    intercomUser,
    drawerClasses,
  } = initializeNavigationDrawerHooks(
    bannerVisibleFlag,
    setBannerVisibleFlag,
    hasCreditCardExpirationMessage,
  );

  return (
    <>
      <MaterialDrawer
        classes={{
          root: drawerClasses.drawer,
          paper: drawerClasses.drawerPaper,
        }}
        variant="permanent"
        anchor="left"
      >
        <NavigationSidebar
          currentUser={user}
          currentOrganization={currentOrganization}
          selectCurrentOrganization={selectCurrentOrganization}
        />
        {intercomUser && intercomUser.name && (
          <Intercom appID={INTERCOM_APP_CODE} {...intercomUser} />
        )}
      </MaterialDrawer>
    </>
  );
};

const NavigationHeader = ({
  bannerVisibleFlag,
  setBannerVisibleFlag,
  hasCreditCardExpirationMessage,
  creditCardExpirationMessage,
}) => {
  const {
    header,
    messageBannerBar,
    hasMinimalUsagePeriodPassed,
    trialEndLabel,
    drawerClasses,
    bannerMessageLinkFlag,
    isHeaderVisible,
  } = initializeNavigationHeaderHooks(
    bannerVisibleFlag,
    setBannerVisibleFlag,
    hasCreditCardExpirationMessage,
  );

  const Header = useCallback(
    () => (
      <Grid container item xs={12}>
        {header?.layout?.map(renderHeaderColumn)}
      </Grid>
    ),
    [header],
  );
  return (
    <>
      {isHeaderVisible && (
        <AppBar className={clsx(drawerClasses.appBar)}>
          <Header />
          <TrialBannerContainer
            item
            xs={12}
            container
            justify="center"
            alignItems="center"
          >
            <TrialBanner
              bannerVisible={bannerVisibleFlag}
              hasCreditCardExpirationMessage={hasCreditCardExpirationMessage}
            >
              <MontserratTypography weight="600" variant="h4">
                <span>
                  {creditCardExpirationMessage ||
                    messageBannerBar ||
                    trialEndLabel}
                </span>
                {bannerMessageLinkFlag && !hasCreditCardExpirationMessage && (
                  <TrialBannerLink to={SUBS_SETTINGS_PATH}>
                    {hasMinimalUsagePeriodPassed
                      ? 'Subscribe Now'
                      : 'Learn more'}
                  </TrialBannerLink>
                )}
              </MontserratTypography>
            </TrialBanner>
          </TrialBannerContainer>
        </AppBar>
      )}
    </>
  );
};

const NavigationContainer = ({ children }) => {
  const {
    bannerVisibleFlag,
    setBannerVisibleFlag,
    hasCreditCardExpirationMessage,
    creditCardExpirationMessage,
  } = initializeNavigationTemplateHooks();

  return (
    <DrawerContainer>
      <NavigationDrawer
        bannerVisibleFlag={bannerVisibleFlag}
        setBannerVisibleFlag={setBannerVisibleFlag}
        hasCreditCardExpirationMessage={hasCreditCardExpirationMessage}
      />
      <MainContainer>
        <NavigationHeader
          bannerVisibleFlag={bannerVisibleFlag}
          setBannerVisibleFlag={setBannerVisibleFlag}
          hasCreditCardExpirationMessage={hasCreditCardExpirationMessage}
          creditCardExpirationMessage={creditCardExpirationMessage}
        />
        {children}
      </MainContainer>
    </DrawerContainer>
  );
};

const NavigationTemplate = ({ children }) => {
  return (
    <NavigationContainer>
      <ContentContainer id="content-container">
        <GlobalAlertChip />
        {children}
      </ContentContainer>
    </NavigationContainer>
  );
};

export default NavigationTemplate;
