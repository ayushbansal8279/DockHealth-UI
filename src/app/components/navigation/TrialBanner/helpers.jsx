import React from 'react';
import moment from 'moment';
import { TrialBannerLink } from './styled';

const TRIAL_USAGE_THRESHOLD_PERIOD = 5;
const CARD_EXPIRATION_WARNING_DAYS = 15;

export function getTrialEndLabel(trialEndDate, subscriptionPlanName) {
  const trialEndMoment = moment(trialEndDate ?? null);

  const trialEndDayDifference = trialEndMoment.isValid()
    ? trialEndMoment.diff(moment(), 'day')
    : 0;

  const hasMinimalUsagePeriodPassed =
    trialEndDayDifference < TRIAL_USAGE_THRESHOLD_PERIOD;

  const trialLabelMinimalPeriodNotPassed = `You are in a ${subscriptionPlanName}. There ${
    trialEndDayDifference > 1
      ? `are ${trialEndDayDifference} days`
      : `is ${trialEndDayDifference} day`
  } left in your trial.`;

  const trialLabelMinimalPeriodPassed = `${trialLabelMinimalPeriodNotPassed}`;

  const trialLabelEnded = `Your ${subscriptionPlanName} has expired!`;

  if (hasMinimalUsagePeriodPassed) {
    return trialEndDayDifference < 0
      ? trialLabelEnded
      : trialLabelMinimalPeriodPassed;
  }

  return '';
}

export function getCreditCardExpirationMessage(cardExpirationDate) {
  if (cardExpirationDate) {
    const cardExpirationMoment = moment(cardExpirationDate, 'M/YYYY')
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
}
