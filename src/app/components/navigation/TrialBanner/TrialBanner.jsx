/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  organizationSelector,
  billingDetailsSelector,
  messageBannerBarSelector,
} from 'selectors/organization-selectors';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import {
  getPaidPlanCancelDate,
  getSubscriptionEndInfo,
  isPlanTrial,
  shouldShowFinalCancelBanner,
  shouldShowImmediateCancelBanner,
} from 'helpers/subscription-helper';
import palette from 'styles/palette';
import {
  TrialBannerContainer,
  TrialBannerLink,
  CancelBannerIcon,
  CancelBannerContent,
} from './styled';
import { getCreditCardExpirationMessage, getTrialEndLabel } from './helpers';

const TrialBanner = () => {
  const [bannerVisibleFlag, setBannerVisibleFlag] = useState(false);
  const [bannerMessageLinkFlag, setBannerMessageLinkFlag] = useState(false);

  const organization = useSelector(organizationSelector);
  const currentUser = useSelector(userProfileSelector);
  const messageBannerBar = useSelector(messageBannerBarSelector);
  const billingDetails = useSelector(billingDetailsSelector);
  const cardExpiration = billingDetails?.cardExpiration;
  const subscription = organization?.subscriptionDetails;
  const paidPlanCancelDate = getPaidPlanCancelDate(
    currentUser,
    organization?.organizationIdentifier,
  );
  const subscriptionCancelDate = paidPlanCancelDate;
  const { daysRemaining, formattedDate, daysText } = getSubscriptionEndInfo(
    subscriptionCancelDate,
  );
  const showImmediateCancelBanner = shouldShowImmediateCancelBanner(
    subscriptionCancelDate,
    daysRemaining,
  );
  const showFinalCancelBanner = shouldShowFinalCancelBanner(
    subscriptionCancelDate,
    daysRemaining,
  );
  const isTrialSubscriptionPlan = isPlanTrial(subscription);
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

  // Calculate cancellation banner messages
  const getImmediateCancelMessage = () => {
    return (
      <>
        Your subscription is canceled and will end in{' '}
        <strong>
          {daysRemaining} {daysText} on {formattedDate}
        </strong>
        . Your data will be recoverable for 30 days after cancelation, then
        permanently deleted.
      </>
    );
  };

  const getFinalCancelMessage = () => {
    return 'Your subscription has been canceled. Your data will be recoverable for 30 days after cancelation, then permanently deleted.';
  };

  // Determine which message to show (prioritize immediate cancel over final cancel)
  const getCancelBannerMessage = () => {
    if (showImmediateCancelBanner) {
      return getImmediateCancelMessage();
    }
    if (showFinalCancelBanner) {
      return getFinalCancelMessage();
    }
    return null;
  };

  const cancelBannerMessage = getCancelBannerMessage();
  const showCancelBanner = showImmediateCancelBanner || showFinalCancelBanner;

  // Only show existing banners if cancel banners are not showing
  const isBannerVisible =
    showCancelBanner || bannerVisibleFlag || !!creditCardExpirationMessage;

  // Determine which message to display
  const displayMessage =
    cancelBannerMessage ||
    creditCardExpirationMessage ||
    messageBannerBar ||
    trialEndLabel;
  return (
    <TrialBannerContainer
      isBannerVisible={isBannerVisible}
      uppercase={!creditCardExpirationMessage && !showCancelBanner}
      isCancelBanner={showCancelBanner}
    >
      {showCancelBanner && (
        <CancelBannerIcon>
          <ErrorOutlineIcon
            style={{
              fontSize: '20px',
              color: palette.mediumGrey || palette.coolGrey1,
            }}
          />
        </CancelBannerIcon>
      )}
      <CancelBannerContent>
        <span>{displayMessage}</span>
        {bannerMessageLinkFlag &&
          !creditCardExpirationMessage &&
          !showCancelBanner &&
          isOrganizationAdmin && (
            <TrialBannerLink to={SUBS_SETTINGS_PATH}>
              {trialEndLabel ? 'Subscribe Now' : 'Learn more'}
            </TrialBannerLink>
          )}
      </CancelBannerContent>
    </TrialBannerContainer>
  );
};

export default TrialBanner;
