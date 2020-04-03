import {
  AppBar,
  Drawer as MaterialDrawer,
  Grid,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
// import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Intercom from 'react-intercom';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { getOrganizationById } from '../../actions/organization-actions';
import * as referralApi from '../../api/referral-api';
import useBoolean from '../../hooks/useBoolean';
import { themeMontserrat600 } from '../../theme-montserrat';
import { getSubscriptionIsTrial, getSubscriptionPlanTrialLabel } from '../../views/self-serve/subscriptions/SubscriptionsView.Utilities';
import {
  ContentContainer,
  TrialBanner,
  TrialBannerLink,
  useDrawerClasses,
} from './Drawer.Styled';
import DrawerList from './DrawerList';

const MINIMAL_TRIAL_USAGE_PERIOD = 20;
const TRIAL_USAGE_PERIOD = 30;

const renderHeaderColumn = ({ key, component, ...otherProps }) => (
  <Grid item container key={key} {...otherProps}>
    {component}
  </Grid>
);

const getCustomTitleFromReferralConfig = async (referralCode, setBannerTitle) => {
  console.log(referralCode);
  if (referralCode !== undefined && referralCode !== "undefined") {
    const referralConfig = await referralApi.getConfigurationForReferral(
      referralCode,
    );
    console.log(referralConfig);
    if(referralConfig){
      setBannerTitle(referralConfig.messageBannerBar);
    }
  }
};

const Drawer = ({ children }) => {
  const [isOpen, open, close] = useBoolean(false);
  const [activeId, setActiveId] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');

  const { user, lists, header } = useSelector(store => ({
    user: store.userState.userProfile,
    lists: store.taskListState.tasklist,
    header: store.header,
  }));

  const intercomUser = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

  const dispatch = useDispatch();

  const currentUser = useSelector(store => store.userState.userProfile);

  const { organization, organizationIdentifier } = useSelector(store => ({
    ...store.organizationState,
    organizationIdentifier:
      store.userState?.userProfile?.organizationIdentifier,
  }));

  const subscription = organization?.subscriptionDetails;

  const subscriptionPlanTrialLabel = getSubscriptionPlanTrialLabel({
    subscription,
  });

  const trialEndMoment = moment(subscription?.trialEndDate ?? null);

  const trialEndDayDifference = trialEndMoment.isValid()
    ? trialEndMoment.diff(moment(), 'day')
    : 0;

  const hasMinimalUsagePeriodPassed =
    trialEndDayDifference < TRIAL_USAGE_PERIOD - MINIMAL_TRIAL_USAGE_PERIOD;

  const trialLabelMinimalPeriodNotPassed = `You are in a free ${subscriptionPlanTrialLabel} trial. There are ${trialEndDayDifference} days left in your trial.`;

  const trialLabelMinimalPeriodPassed = `${trialLabelMinimalPeriodNotPassed} You will lose access at the end of your trial.`;

  const trialLabelEnded = `Your free ${subscriptionPlanTrialLabel} trial has expired!`;

  const trialEndLabel = (() => {
    if (hasMinimalUsagePeriodPassed) {
      return trialEndDayDifference < 0
        ? trialLabelEnded
        : trialLabelMinimalPeriodPassed;
    }

    return trialLabelMinimalPeriodNotPassed;
  })();

  // setBannerTitle(trialEndLabel)

  const showBannerMessageLink = false;

  // const hasMinimalUsagePeriodPassed = false;
  // const trialEndLabel =
  //   'In Response to COVID-19, Dock Health is Offering its Platform for Free.';

  // const bannerVisible = isSubscriptionTrial;
  // const bannerVisible = true;

  const drawerClasses = useDrawerClasses({
    header,
    isOpen,
    bannerVisible,
  });

  useMount(() => {
    if (organizationIdentifier) {
      getOrganizationById({ organizationIdentifier })(dispatch);
    }
    console.log(currentUser.referralCode)
    getCustomTitleFromReferralConfig(currentUser.referralCode, setBannerTitle);
  });

  useEffect(() => {
    if (organization) {
      const subscription = organization?.subscriptionDetails;

      const isSubscriptionTrial = getSubscriptionIsTrial({
        subscription,
      });
      setBannerVisible(isSubscriptionTrial);
    }
  }, [organization]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexFlow: 'column nowrap',
        overflow: 'hidden',
      }}
    >
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
        <TrialBanner
          item
          xs={12}
          container
          justify="center"
          alignItems="center"
          bannerVisible={bannerVisible}
        >
          <ThemeProvider theme={themeMontserrat600}>
            <Typography variant="h4">
              <span>{bannerTitle && bannerTitle != "" ? bannerTitle : trialEndLabel}</span>
              {showBannerMessageLink && (
                <TrialBannerLink to="/subscriptions">
                  {hasMinimalUsagePeriodPassed ? 'Subscribe Now' : 'Learn more'}
                </TrialBannerLink>
              )}
            </Typography>
          </ThemeProvider>
        </TrialBanner>
      </AppBar>
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
          onMouseLeave={close}
          open={isOpen}
          user={user}
          lists={lists}
          bannerVisible={bannerVisible}
        />
        <Intercom appID="q7dotpic" {...intercomUser} />
      </MaterialDrawer>
      <ContentContainer id="content-container" open={isOpen}>
        {children}
      </ContentContainer>
    </div>
  );
};

export default Drawer;
