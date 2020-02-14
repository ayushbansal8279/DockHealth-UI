import { times } from 'ramda';
import React, { useCallback, useRef, useState } from 'react';
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
  recalculateEstimate,
  billingFrequency,
  subscriptionPlanData,
}) => {
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(
    subscriptionPlanData?.planIsTrial ?? false,
  );

  const [chosenSubscriptionPlan, setChosenSubscriptionPlan] = useState(
    chosenPlan?.subscriptionPlan,
  );
  const [chosenBillingFrequency, setChosenBillingFrequency] = useState(
    billingFrequency,
  );

  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );

  const newBillingFrequency = annualPayment
    ? BILLING_FREQUENCY.MONTHLY
    : BILLING_FREQUENCY.ANNUAL;

  const changeSubscriptionPlan = useCallback(
    ({ subscriptionPlan, billingFrequency: changedBillingFrequency }) => {
      if (subscriptionPlan) {
        setChosenSubscriptionPlan(subscriptionPlan);
      }

      return recalculateEstimate(
        subscriptionPlan ?? chosenSubscriptionPlan,
        changedBillingFrequency ?? chosenBillingFrequency,
      );
    },
    [chosenBillingFrequency, chosenSubscriptionPlan, recalculateEstimate],
  );

  const toggleAnnualPayment = useCallback(() => {
    setChosenBillingFrequency(newBillingFrequency);

    changeSubscriptionPlan({ billingFrequency: newBillingFrequency }).then(
      () => {
        toggleAnnualPaymentRaw();
      },
    );
  }, [changeSubscriptionPlan, newBillingFrequency, toggleAnnualPaymentRaw]);

  useUnmount(() => {
    setChosenPlan(currentPlan);
    recalculateEstimate();
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
      subscriptionPlanData={subscriptionPlanData}
    />
  );
};

export default SubscriptionsPlansView;
