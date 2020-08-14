import { AppBar, Drawer as MaterialDrawer, Grid } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import Intercom from 'react-intercom';
import { MontserratTypography } from 'styles/theme-montserrat';
import GlobalAlertChip from 'alert/GlobalAlertChip';
import initializeDrawerHooks from './hooks';
import DrawerList from './DrawerList/DrawerList';
import {
  DrawerContainer,
  ContentContainer,
  TrialBanner,
  TrialBannerContainer,
  TrialBannerLink,
} from './styled';

const renderHeaderColumn = ({ key, component, ...otherProps }) => (
  <Grid item container key={key} {...otherProps}>
    {component}
  </Grid>
);

const Drawer = ({ children }) => {
  const {
    isOpen,
    open,
    close,
    activeId,
    setActiveId,
    user,
    lists,
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
    isNavbarInFullMode,
    areNavbarSettingsVisible,
    hideNavbar,
  } = initializeDrawerHooks();

  return (
    <DrawerContainer>
      {isHeaderVisible && (
        <AppBar
          className={clsx(
            drawerClasses.appBar,
            isOpen && drawerClasses.appBarOpen,
          )}
          position="fixed"
        >
          <div className={drawerClasses.appBarBorder} />
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
                  <TrialBannerLink to="/subscriptions">
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
      <MaterialDrawer
        classes={{
          root: drawerClasses.drawer,
          paper: drawerClasses.drawerPaper,
        }}
        variant="permanent"
        anchor="left"
      >
        <DrawerList
          activeId={activeId}
          setActiveId={setActiveId}
          onMouseEnter={open}
          onMouseLeave={isNavbarInFullMode ? hideNavbar : close}
          open={isNavbarInFullMode || isOpen}
          user={user}
          lists={lists}
          bannerVisible={bannerVisibleFlag}
          settingsVisible={areNavbarSettingsVisible}
        />
        <Intercom appID="q7dotpic" {...intercomUser} />
      </MaterialDrawer>
      <ContentContainer
        id="content-container"
        isFullView={isNavbarInFullMode}
        open={isOpen}
      >
        <GlobalAlertChip />
        {children}
      </ContentContainer>
    </DrawerContainer>
  );
};

export default Drawer;
