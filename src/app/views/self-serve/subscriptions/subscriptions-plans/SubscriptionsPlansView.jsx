import { times } from 'ramda';
import React, { useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { useToggle, useUnmount } from 'react-use';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';

const SubscriptionsPlansView = ({
  chosenPlan,
  setChosenPlan,
  currentPlan,
  annualPayment,
  toggleAnnualPayment: toggleAnnualPaymentRaw,
  billingFrequency,
  recalculateEstimate,
}) => {
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);

  // const billingDetails =
  //   useSelector(store => store.organizationState.billingDetails) || {};

  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );

  const { subscriptionPlan: defaultSubscriptionPlan } = chosenPlan || {};

  const changeSubscriptionPlan = useCallback(
    ({ subscriptionPlan, billingFrequency }) => {
      recalculateEstimate(subscriptionPlan, billingFrequency);
    },
    [recalculateEstimate],
  );

  const newBillingFrequency = annualPayment
    ? BILLING_FREQUENCY.MONTHLY
    : BILLING_FREQUENCY.ANNUAL;

  const toggleAnnualPayment = useCallback(() => {
    changeSubscriptionPlan({ billingFrequency: newBillingFrequency }).then(
      () => {
        toggleAnnualPaymentRaw();
      },
    );
  }, [changeSubscriptionPlan, newBillingFrequency, toggleAnnualPaymentRaw]);

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
      chosenBillingFrequency={newBillingFrequency}
      changeSubscriptionPlan={changeSubscriptionPlan}
    />
  );
};

export default SubscriptionsPlansView;
