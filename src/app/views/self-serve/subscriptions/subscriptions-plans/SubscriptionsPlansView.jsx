import { times } from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useToggle } from 'react-use';
import { setPaymentNewPlan } from '../../../../actions/organization-actions';
import { selectSubscriptionPlan } from '../../../../api/organization-api';
import {
  BottomButtonContainer,
  StyledButton,
} from '../SubscriptionsView.Styled';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import {
  subscriptionFeatures,
  subscriptionPlanData,
  SUBSCRIPTION_PLAN_KEYS,
} from './SubscriptionsPlansView.PlanData';

const goToSubscriptionPayment = () => {
  hashHistory.push('/subscription-payment');
};

const onSubscriptionPlanChosen = ({
  annualPayment,
  chosenPlan,
  organizationId,
  billingFrequency,
  dispatch,
}) => () => {
  const { subscriptionPlan } = chosenPlan || {};

  if (subscriptionPlan) {
    const newPlan = {
      ...chosenPlan,
      annualPayment,
      selectSubscriptionPlan: () =>
        selectSubscriptionPlan({
          organizationId,
          subscriptionPlan,
          billingFrequency,
        }),
    };

    setPaymentNewPlan({ newPlan })(dispatch);
    goToSubscriptionPayment();
  }
};

const SubscriptionsPlansView = ({
  organizationId,
  organization,
  hideSubscriptionPlans,
  isCancelVisible,
}) => {
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  const dispatch = useDispatch();

  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );

  useEffect(() => {
    if (organization) {
      const { subscriptionDetails } = organization;

      toggleAnnualPayment(
        subscriptionDetails.billingFrequency === BILLING_FREQUENCY.ANNUAL,
      );

      const newCurrentPlan =
        subscriptionPlanData.find(
          ({ subscriptionPlan }) =>
            subscriptionPlan === subscriptionDetails.subscriptionPlan,
        ) ?? null;

      setCurrentPlan(newCurrentPlan);
      setChosenPlan(newCurrentPlan);
    }
  }, [organization, toggleAnnualPayment]);

  const buyButtonDisabled =
    !chosenPlan ||
    chosenPlan?.key === SUBSCRIPTION_PLAN_KEYS.ENTERPRISE ||
    chosenPlan?.key === currentPlan?.key;

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
      />
      <BottomButtonContainer container justify="flex-end">
        {isCancelVisible && (
          <StyledButton variant="outlined" onClick={hideSubscriptionPlans}>
            Cancel
          </StyledButton>
        )}
        <StyledButton
          disabled={buyButtonDisabled}
          variant="contained"
          onClick={onSubscriptionPlanChosen({
            annualPayment,
            billingFrequency: annualPayment
              ? BILLING_FREQUENCY.ANNUAL
              : BILLING_FREQUENCY.MONTHLY,
            chosenPlan,
            organizationId,
            dispatch,
          })}
        >
          Buy this plan
        </StyledButton>
      </BottomButtonContainer>
    </>
  );
};

export default SubscriptionsPlansView;
