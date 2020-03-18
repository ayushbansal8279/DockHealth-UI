import {
  AppBar,
  Drawer as MaterialDrawer,
  Grid,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
// import moment from 'moment';
import React, { useState } from 'react';
import Intercom from 'react-intercom';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { getOrganizationById } from '../../actions/organization-actions';
import useBoolean from '../../hooks/useBoolean';
import { themeMontserrat600 } from '../../theme-montserrat';
import { getSubscriptionIsTrial } from '../../views/self-serve/subscriptions/SubscriptionsView.Utilities';
import {
  ContentContainer,
  TrialBanner,
  TrialBannerLink,
  useDrawerClasses,
} from './Drawer.Styled';
import DrawerList from './DrawerList';

// const MINIMAL_TRIAL_USAGE_PERIOD = 20;
// const TRIAL_USAGE_PERIOD = 30;

const renderHeaderColumn = ({ key, component, ...otherProps }) => (
  <Grid item container key={key} {...otherProps}>
    {component}
  </Grid>
);

const Drawer = ({ children }) => {
  const [isOpen, open, close] = useBoolean(false);
  const [activeId, setActiveId] = useState('');

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

  const { organization, organizationIdentifier } = useSelector(store => ({
    ...store.organizationState,
    organizationIdentifier:
      store.userState?.userProfile?.organizationIdentifier,
  }));

  const subscription = organization?.subscriptionDetails;

  const isSubscriptionTrial = getSubscriptionIsTrial({
    subscription,
  });

  // const subscriptionPlanTrialLabel = getSubscriptionPlanTrialLabel({
  //   subscription,
  // });

  // const trialEndMoment = moment(subscription?.trialEndDate ?? null);

  // const trialEndDayDifference = trialEndMoment.isValid()
  //   ? trialEndMoment.diff(moment(), 'day')
  //   : 0;

  // const hasMinimalUsagePeriodPassed =
  //   trialEndDayDifference < TRIAL_USAGE_PERIOD - MINIMAL_TRIAL_USAGE_PERIOD;

  // const trialLabelMinimalPeriodNotPassed = `You are in a free ${subscriptionPlanTrialLabel} trial. There are ${trialEndDayDifference} days left in your trial.`;

  // const trialLabelMinimalPeriodPassed = `${trialLabelMinimalPeriodNotPassed} You will lose access at the end of your trial.`;

  // const trialLabelEnded = `Your free ${subscriptionPlanTrialLabel} trial has expired!`;

  // const trialEndLabel = (() => {
  //   if (hasMinimalUsagePeriodPassed) {
  //     return trialEndDayDifference < 0
  //       ? trialLabelEnded
  //       : trialLabelMinimalPeriodPassed;
  //   }

  //   return trialLabelMinimalPeriodNotPassed;
  // })();

  const hasMinimalUsagePeriodPassed = false;
  const trialEndLabel =
    'In Response to COVID-19, Dock Health is Offering its Platform for Free.';

  const trialBannerVisible = isSubscriptionTrial;

  const drawerClasses = useDrawerClasses({
    header,
    isOpen,
    trialBannerVisible,
  });

  useMount(() => {
    if (organizationIdentifier) {
      getOrganizationById({ organizationIdentifier })(dispatch);
    }
  });

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
          trialBannerVisible={trialBannerVisible}
        >
          <ThemeProvider theme={themeMontserrat600}>
            <Typography variant="h4">
              <span>{trialEndLabel}</span>
              <TrialBannerLink to="/subscriptions">
                {hasMinimalUsagePeriodPassed ? 'Subscribe Now' : 'Learn more'}
              </TrialBannerLink>
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
          trialBannerVisible={trialBannerVisible}
        />
        <Intercom appID="q7dotpic" {...intercomUser} />
      </MaterialDrawer>
      <ContentContainer open={isOpen}>{children}</ContentContainer>
    </div>
  );
};

export default Drawer;
