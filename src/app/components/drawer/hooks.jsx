/* eslint-disable react-hooks/rules-of-hooks */
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { templateStateSelector } from 'selectors/template-selectors';
import useBoolean from 'hooks/useBoolean';
import {
  getSubscriptionIsTrial,
  getSubscriptionPlanLabel,
} from 'views/self-serve/subscriptions/SubscriptionsView.Utilities';
import * as TemplateActions from 'actions/template-actions';
import { selectCurrentOrganization } from 'api/user-api';
import { TrialBannerLink, useDrawerClasses } from './styled';

const TRIAL_USAGE_THRESHOLD_PERIOD = 10;
const CARD_EXPIRATION_WARNING_DAYS = 15;

// eslint-disable-next-line sonarjs/cognitive-complexity
const initializeDrawerHooks = () => {
  const [isOpen, open, close] = useBoolean(false);
  const [activeId, setActiveId] = useState('');
  const [bannerVisibleFlag, setBannerVisibleFlag] = useState(false);
  const [bannerMessageLinkFlag, setBannerMessageLinkFlag] = useState(false);
  const history = useHistory();

  const {
    organization,
    billingDetails,
    messageBannerBar,
    user,
    lists,
    header,
    templateState: {
      isHeaderVisible,
      isNavbarInFullMode,
      areNavbarSettingsVisible,
      navbarFullWidth,
      isNavbarVisible,
    },
  } = useSelector(store => ({
    ...store.organizationState,
    messageBannerBar: store.organizationState?.referralConfig?.messageBannerBar,
    user: store.userState.userProfile,
    lists: store.taskListState.tasklist,
    header: store.header,
    templateState: templateStateSelector(store),
  }));

  const intercomUser = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

  const dispatch = useDispatch();

  const subscription = organization?.subscriptionDetails;

  const isTrialSubscriptionPlan = getSubscriptionIsTrial({
    subscription,
  });

  const subscriptionPlanTrialLabel = getSubscriptionPlanLabel({
    subscription,
  });

  const trialEndMoment = moment(subscription?.trialEndDate ?? null);

  const trialEndDayDifference = trialEndMoment.isValid()
    ? trialEndMoment.diff(moment(), 'day')
    : 0;

  const hasMinimalUsagePeriodPassed =
    trialEndDayDifference < TRIAL_USAGE_THRESHOLD_PERIOD;

  const trialLabelMinimalPeriodNotPassed = `You are in a ${subscriptionPlanTrialLabel}. There are ${trialEndDayDifference} days left in your trial.`;

  const trialLabelMinimalPeriodPassed = `${trialLabelMinimalPeriodNotPassed}`;

  const trialLabelEnded = `Your ${subscriptionPlanTrialLabel} has expired!`;

  const trialEndLabel = useMemo(() => {
    if (hasMinimalUsagePeriodPassed) {
      return trialEndDayDifference < 0
        ? trialLabelEnded
        : trialLabelMinimalPeriodPassed;
    }

    return '';
  }, [
    hasMinimalUsagePeriodPassed,
    trialEndDayDifference,
    trialLabelEnded,
    trialLabelMinimalPeriodPassed,
  ]);

  const currentLocationPathname = history.location.pathname;
  const cardExpiration = billingDetails?.cardExpiration;

  const creditCardExpirationMessage = useMemo(() => {
    if (currentLocationPathname?.endsWith('/tasks') && cardExpiration) {
      const cardExpirationMoment = moment(cardExpiration, 'M/YYYY')
        .endOf('month')
        .endOf('day');
      const currentMoment = moment().startOf('day');
      const futureExpirationMoment = moment()
        .startOf('day')
        .add(CARD_EXPIRATION_WARNING_DAYS, 'days');

      if (futureExpirationMoment.isSameOrAfter(cardExpirationMoment)) {
        return (
          <div>
            <span>Your credit card will expire in </span>
            <span>{cardExpirationMoment.diff(currentMoment, 'days')}</span>
            <span> days! To avoid interuption, </span>
            <TrialBannerLink to="/settings/billing">
              update your credit card information
            </TrialBannerLink>
            <span> now.</span>
          </div>
        );
      }
    }

    return null;
  }, [cardExpiration, currentLocationPathname]);

  const hasCreditCardExpirationMessage = Boolean(creditCardExpirationMessage);

  // const hasMinimalUsagePeriodPassed = false;
  // const trialEndLabel =
  //   'In Response to COVID-19, Dock Health is Offering its Platform for Free.';

  // const bannerVisibleFlag = isSubscriptionTrial;

  const drawerClasses = useDrawerClasses({
    header,
    isOpen: isNavbarInFullMode || isOpen,
    navbarFullWidth: navbarFullWidth || 260,
    isNavbarVisible,
    bannerVisible: bannerVisibleFlag || hasCreditCardExpirationMessage,
  });

  useEffect(() => {
    if (organization) {
      const bannerVisibleFlagValue = Boolean(
        messageBannerBar || (isTrialSubscriptionPlan && trialEndLabel !== ''),
      );
      setBannerVisibleFlag(bannerVisibleFlagValue);

      const bannerMessageLinkFlagValue = Boolean(
        !messageBannerBar && trialEndLabel,
      );
      setBannerMessageLinkFlag(bannerMessageLinkFlagValue);
    }
  }, [organization, messageBannerBar, trialEndLabel, isTrialSubscriptionPlan]);

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const currentOrganization =
    user?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  return {
    isOpen,
    open,
    close,
    activeId,
    setActiveId,
    bannerVisibleFlag,
    setBannerVisibleFlag,
    bannerMessageLinkFlag,
    setBannerMessageLinkFlag,
    user,
    lists,
    header,
    intercomUser,
    organization,
    billingDetails,
    messageBannerBar,
    subscription,
    isTrialSubscriptionPlan,
    subscriptionPlanTrialLabel,
    trialEndMoment,
    trialEndDayDifference,
    hasMinimalUsagePeriodPassed,
    trialLabelMinimalPeriodPassed,
    trialLabelMinimalPeriodNotPassed,
    trialLabelEnded,
    trialEndLabel,
    currentLocationPathname,
    cardExpiration,
    creditCardExpirationMessage,
    hasCreditCardExpirationMessage,
    drawerClasses,
    isHeaderVisible,
    isNavbarInFullMode,
    areNavbarSettingsVisible,
    hideNavbar: () => dispatch(TemplateActions.hideNavbar()),
    selectCurrentOrganization: organizationIdentifier =>
      selectCurrentOrganization(organizationIdentifier),
    currentOrganization,
  };
};

export default initializeDrawerHooks;
