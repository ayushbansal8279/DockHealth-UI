import { times } from 'ramda';
import React, { useCallback, useRef, useState } from 'react';
import { useToggle, useUnmount } from 'react-use';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';
import { TermsLabel } from './SubscriptionsPlansView.Styled';

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
    <>
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
      <TermsLabel style={{ fontWeight: 'bold', marginBottom: 0 }}>
        * How long is this free?
      </TermsLabel>
      <TermsLabel style={{ marginTop: 0 }}>
        Before our decision to focus on the COVID-19 response, Dock Health
        offered a 30-day free trial and a subscription model of $20/user/month.
        In light of the urgent need to take care of providers, help them get
        organized and provide them the most relevant information easily, we have
        decided to make it free as long as it can be helpful during this public
        health crisis. We are clinicians and we are optimists. We know this will
        get hard, but we also know we will overcome this. When the dust settles,
        we will be clear and give folks lots of time to prepare if a paid
        subscription is the right choice for you down the road.
      </TermsLabel>
    </>
  );
};

export default SubscriptionsPlansView;
