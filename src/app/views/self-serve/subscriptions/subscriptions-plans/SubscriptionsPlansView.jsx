import { times } from 'ramda';
import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useToggle, useUnmount } from 'react-use';
import { saveBillingDetails } from '../../../../api/organization-api';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';

const SubscriptionsPlansView = ({
  chosenPlan,
  setChosenPlan,
  currentPlan,
  annualPayment,
  toggleAnnualPayment: toggleAnnualPaymentRaw,
  billingFrequency: defaultBillingFrequency,
  recalculateEstimate,
}) => {
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);

  const billingDetails =
    useSelector(store => store.organizationState.billingDetails) || {};

  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );

  const { subscriptionPlan: defaultSubscriptionPlan } = chosenPlan || {};

  const changeSubscriptionPlan = useCallback(
    ({ subscriptionPlan, billingFrequency }) => {
      return saveBillingDetails({
        billingData: {
          name: billingDetails.billingName,
          email: billingDetails.billingEmail,
          address: billingDetails.billingAddressLine1,
          city: billingDetails.billingAddressCity,
          state: billingDetails.billingAddressState,
          zip: billingDetails.billingAddressPostalCode,
          subscriptionDetails: {
            subscriptionPlan: subscriptionPlan ?? defaultSubscriptionPlan,
            billingFrequency: billingFrequency ?? defaultBillingFrequency,
          },
        },
        token: {
          token: {
            id: billingDetails?.cardTokenIdentifier,
          },
        },
      }).then(() => {
        recalculateEstimate();
      });
    },
    [
      billingDetails,
      defaultBillingFrequency,
      defaultSubscriptionPlan,
      recalculateEstimate,
    ],
  );

  const toggleAnnualPayment = useCallback(() => {
    const newBillingFrequency = annualPayment
      ? BILLING_FREQUENCY.MONTHLY
      : BILLING_FREQUENCY.ANNUAL;

    changeSubscriptionPlan({ billingFrequency: newBillingFrequency }).then(
      () => {
        toggleAnnualPaymentRaw();
      },
    );
  }, [annualPayment, changeSubscriptionPlan, toggleAnnualPaymentRaw]);

  useUnmount(() => {
    setChosenPlan(currentPlan);
  });

  return (
    <PlanCardsContainer
      toggleAnnualPayment={toggleAnnualPayment}
      toggleFeatureListExpanded={toggleFeatureListExpanded}
      featureListExpanded={featureListExpanded}
      featureRowReferences={featureRowReferences}
      annualPayment={annualPayment}
      setChosenPlan={setChosenPlan}
      chosenPlan={chosenPlan}
      changeSubscriptionPlan={changeSubscriptionPlan}
    />
  );
};

export default SubscriptionsPlansView;
