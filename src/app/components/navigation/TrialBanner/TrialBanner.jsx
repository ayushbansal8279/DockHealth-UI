/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  organizationSelector,
  billingDetailsSelector,
  messageBannerBarSelector,
} from 'selectors/organization-selectors';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import { isPlanTrial } from 'helpers/subscription-helper';
import { TrialBannerContainer, TrialBannerLink } from './styled';
import { getCreditCardExpirationMessage, getTrialEndLabel } from './helpers';

const TrialBanner = () => {
  const [bannerVisibleFlag, setBannerVisibleFlag] = useState(false);
  const [bannerMessageLinkFlag, setBannerMessageLinkFlag] = useState(false);

  const organization = useSelector(organizationSelector);
  const messageBannerBar = useSelector(messageBannerBarSelector);
  const billingDetails = useSelector(billingDetailsSelector);

  const cardExpiration = billingDetails?.cardExpiration;
  const subscription = organization?.subscriptionDetails;

  const isTrialSubscriptionPlan = isPlanTrial(subscription);
  const currentUser = useSelector(userProfileSelector);
  const isOrganizationAdmin = ['ADMIN', 'OWNER'].includes(
    currentUser?.orgUserRole,
  );

  const creditCardExpirationMessage = useMemo(
    () => getCreditCardExpirationMessage(cardExpiration),
    [cardExpiration],
  );

  const { subscriptionPlanName, trialEndDate } = subscription || {};

  const trialEndLabel = useMemo(
    () => getTrialEndLabel(trialEndDate, subscriptionPlanName),
    [trialEndDate, subscriptionPlanName],
  );

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

  const isBannerVisible = bannerVisibleFlag || !!creditCardExpirationMessage;

  return (
    <TrialBannerContainer
      isBannerVisible={isBannerVisible}
      uppercase={!creditCardExpirationMessage}
    >
      <span>
        {creditCardExpirationMessage || messageBannerBar || trialEndLabel}
      </span>
      {bannerMessageLinkFlag &&
        !creditCardExpirationMessage &&
        isOrganizationAdmin && (
          <TrialBannerLink to={SUBS_SETTINGS_PATH}>
            {trialEndLabel ? 'Subscribe Now' : 'Learn more'}
          </TrialBannerLink>
        )}
    </TrialBannerContainer>
  );
};

export default TrialBanner;
