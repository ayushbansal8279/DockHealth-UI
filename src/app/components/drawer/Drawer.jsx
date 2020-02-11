import MaterialDrawer from '@material-ui/core/Drawer';
import moment from 'moment';
import { path } from 'ramda';
import React from 'react';
import Intercom from 'react-intercom';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { getOrganizationById } from '../../actions/organization-actions';
import useBoolean from '../../hooks/useBoolean';
import {
  getSubscriptionIsTrial,
  getSubscriptionPlanTrialLabel,
} from '../../views/self-serve/subscriptions/SubscriptionsView.Utilities';
import DrawerList from './DrawerList';
import DrawerTitle from './DrawerTitle';

const StyledDrawer = styled(MaterialDrawer).attrs({
  variant: 'permanent',
  classes: {
    paper: 'paper',
  },
})`
  && {
    flex-shrink: 0;
    white-space: nowrap;
    .paper {
      background: #2a4a70;
      border: 0;
      overflow: initial;
      width: ${({ open }) => (open ? 260 : 85)}px;
      transition: width 0.2s ease-out;
    }
  }
`;

const ContentContainer = styled.div`
  ${({ open }) =>
    open ? 'width: calc(100% - 260px);' : 'width: calc(100% - 85px);'}
  ${({ open }) => (open ? 'margin-left: 260px;' : 'margin-left: 85px;')}
  margin-top: ${({ topPadded, trialBannerVisible }) => {
    let topMargin = 0;

    if (topPadded) {
      topMargin += 88;

      if (trialBannerVisible) {
        topMargin += 46;
      }
    }

    return topMargin;
  }}px;
  position: relative;
  transition: width .2s ease-out, margin .2s ease-out;
`;

const Drawer = ({ header, user, lists, children }) => {
  const [isOpen, open, close] = useBoolean(false);

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

  const trialBannerVisible = getSubscriptionIsTrial({
    subscription,
  });

  const subscriptionPlanTrialLabel = getSubscriptionPlanTrialLabel({
    subscription,
  });

  const trialEndMoment = moment(subscription?.trialEndDate ?? null);

  const trialEndDayDifference = trialEndMoment.isValid()
    ? Math.abs(trialEndMoment.diff(moment(), 'day'))
    : null;

  const trialEndDateLabel =
    trialEndDayDifference > 0 ? `in ${trialEndDayDifference} days` : 'soon';

  const trialEndLabel = `Your ${subscriptionPlanTrialLabel} free trial will expire ${trialEndDateLabel}.`;

  useMount(() => {
    getOrganizationById({ organizationIdentifier })(dispatch);
  });

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <StyledDrawer open={isOpen}>
        <DrawerList
          onMouseEnter={open}
          onMouseLeave={close}
          open={isOpen}
          user={user}
          lists={lists}
        />
        <DrawerTitle
          header={header}
          trialBannerVisible={trialBannerVisible}
          trialEndLabel={trialEndLabel}
        />
        <Intercom appID="q7dotpic" {...intercomUser} />
      </StyledDrawer>
      <ContentContainer
        topPadded={header.show}
        trialBannerVisible={trialBannerVisible}
        open={isOpen}
      >
        {children}
      </ContentContainer>
    </div>
  );
};

const ConnectedDrawer = ({ children, ...props }) => {
  const selectors = {
    user: useSelector(path(['userState', 'userProfile'])),
    lists: useSelector(path(['taskListState', 'tasklist'])),
    header: useSelector(path(['header'])),
  };

  return (
    <Drawer {...props} {...selectors}>
      {children}
    </Drawer>
  );
};

export default ConnectedDrawer;
