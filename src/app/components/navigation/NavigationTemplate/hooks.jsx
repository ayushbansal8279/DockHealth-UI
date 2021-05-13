/* eslint-disable react-hooks/rules-of-hooks */
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { templateStateSelector } from 'selectors/template-selectors';
import {
  organizationSelector,
  billingDetailsSelector,
  messageBannerBarSelector,
} from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  getSubscriptionIsTrial,
  getSubscriptionPlanLabel,
} from 'views/self-serve/subscriptions/helpers';
import { selectCurrentOrganization } from 'api/user-api';
import { TrialBannerLink, useDrawerClasses } from './styled';

const TRIAL_USAGE_THRESHOLD_PERIOD = 10;
const CARD_EXPIRATION_WARNING_DAYS = 15;

export const initializeNavigationTemplateHooks = () => {
  const history = useHistory();
  const [bannerVisibleFlag, setBannerVisibleFlag] = useState(false);
  const billingDetails = useSelector(billingDetailsSelector);

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

  return {
    bannerVisibleFlag,
    setBannerVisibleFlag,
    hasCreditCardExpirationMessage,
    creditCardExpirationMessage,
  };
};

export const initializeNavigationHeaderHooks = (
  bannerVisibleFlag,
  setBannerVisibleFlag,
  hasCreditCardExpirationMessage,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const [bannerMessageLinkFlag, setBannerMessageLinkFlag] = useState(false);
  const organization = useSelector(organizationSelector);
  const messageBannerBar = useSelector(messageBannerBarSelector);
  const { isHeaderVisible, isNavbarVisible, header } = useSelector(
    templateStateSelector,
  );

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

  const drawerClasses = useDrawerClasses({
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
  }, [
    organization,
    messageBannerBar,
    trialEndLabel,
    isTrialSubscriptionPlan,
    setBannerVisibleFlag,
  ]);

  return {
    bannerMessageLinkFlag,
    setBannerMessageLinkFlag,
    header,
    organization,
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
    hasCreditCardExpirationMessage,
    drawerClasses,
    isHeaderVisible,
  };
};

export const initializeNavigationDrawerHooks = (
  bannerVisibleFlag,
  hasCreditCardExpirationMessage,
) => {
  const user = useSelector(userProfileSelector);
  const { isNavbarVisible } = useSelector(templateStateSelector);
  const intercomUser = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

  const drawerClasses = useDrawerClasses({
    isNavbarVisible,
    bannerVisible: bannerVisibleFlag || hasCreditCardExpirationMessage,
  });

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const currentOrganization =
    user?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  return {
    user,
    intercomUser,
    selectCurrentOrganization: organizationIdentifier =>
      selectCurrentOrganization(organizationIdentifier),
    currentOrganization,
    drawerClasses,
  };
};
