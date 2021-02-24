import { AppBar, Drawer as MaterialDrawer, Grid } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import Intercom from 'react-intercom';
import { MontserratTypography } from 'styles/theme-montserrat';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import NavigationSidebar from 'components/navigation/NavigationSidebar/NavigationSidebar';
import initializeDrawerHooks from './hooks';
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

const NavigationTemplate = ({ children }) => {
  const {
    user,
    currentOrganization,
    selectCurrentOrganization,
    header,
    intercomUser,
    messageBannerBar,
    hasMinimalUsagePeriodPassed,
    trialEndLabel,
    creditCardExpirationMessage,
    hasCreditCardExpirationMessage,
    drawerClasses,
    bannerVisibleFlag,
    bannerMessageLinkFlag,
    isHeaderVisible,
  } = initializeDrawerHooks();

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
        <NavigationSidebar
          currentUser={user}
          currentOrganization={currentOrganization}
          selectCurrentOrganization={selectCurrentOrganization}
        />
        <Intercom appID={INTERCOM_APP_CODE} {...intercomUser} />
      </MaterialDrawer>
      <MainContainer>
        {isHeaderVisible && (
          <AppBar className={clsx(drawerClasses.appBar)}>
            <Grid container item xs={12}>
              {header?.layout?.map(renderHeaderColumn)}
            </Grid>
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
                    <TrialBannerLink to="/settings/subscriptions">
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
        <ContentContainer id="content-container">
          <GlobalAlertChip />
          {children}
        </ContentContainer>
      </MainContainer>
    </DrawerContainer>
  );
};

export default NavigationTemplate;
