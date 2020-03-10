import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MaterialDrawer from '@material-ui/core/Drawer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState } from 'react';
import Intercom from 'react-intercom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { getOrganizationById } from '../../actions/organization-actions';
import useBoolean from '../../hooks/useBoolean';
import {
  getSubscriptionIsTrial,
  getSubscriptionPlanTrialLabel,
} from '../../views/self-serve/subscriptions/SubscriptionsView.Utilities';
import DrawerList from './DrawerList';

const MINIMAL_TRIAL_USAGE_PERIOD = 20;
const TRIAL_USAGE_PERIOD = 30;

const useDrawerClasses = makeStyles({
  appBar: {
    backgroundColor: '#3d4858',
    color: '#fff',
    fontSize: '2.25rem',
    height: ({ trialBannerVisible }) =>
      trialBannerVisible ? '8.375rem' : '5.5rem',
    marginLeft: 85,
    paddingBottom: ({ trialBannerVisible }) =>
      trialBannerVisible ? '2.875rem' : 0,
    paddingLeft: '1.25rem',
    position: 'relative',
    transition: 'all 0.2s ease-out, height 0s, padding-bottom 0s',
    width: 'calc(100% - 85px)',
  },
  appBarOpen: {
    marginLeft: 260,
    width: 'calc(100% - 260px)',
  },
  appBarBorder: {
    backgroundColor: '#c1ccda',
    height: '0.25rem',
    left: 0,
    position: 'absolute',
    top: '5.25rem',
    width: '100%',
    zIndex: 1,
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    background: '#3d4858',
    border: 0,
    overflow: 'initial',
    width: ({ isOpen }) => (isOpen ? 260 : 85),
    transition: 'width 0.2s ease-out',
  },
});

const ContentContainer = styled.div`
  ${({ open }) =>
    open ? 'width: calc(100% - 260px);' : 'width: calc(100% - 85px);'}
  ${({ open }) =>
    open ? 'margin-left: 260px;' : 'margin-left: 85px;'}
  overflow-y: auto;
  position: relative;
  transition: width 0.2s ease-out, margin 0.2s ease-out;
`;

const TrialBanner = styled(Grid)`
  background-color: #2a4a70;
  bottom: 0;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  left: 0;
  height: 2.875rem;
  right: 0;
  position: absolute;
  z-index: 1;
`;

const TrialBannerLink = styled(Link)`
  color: #fff;
  margin-left: 0.25rem;
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: #eee;
  }
`;

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
        {trialBannerVisible && (
          <TrialBanner
            item
            xs={12}
            container
            justify="center"
            alignItems="center"
          >
            <span>{trialEndLabel}</span>
            <TrialBannerLink to="/subscriptions">
              {hasMinimalUsagePeriodPassed ? 'Subscribe Now' : 'Learn more'}
            </TrialBannerLink>
          </TrialBanner>
        )}
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
        />
        <Intercom appID="q7dotpic" {...intercomUser} />
      </MaterialDrawer>
      <ContentContainer open={isOpen}>{children}</ContentContainer>
    </div>
  );
};

export default Drawer;
