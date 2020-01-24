import { times } from 'ramda';
import React, { useRef, useState } from 'react';
import { useToggle } from 'react-use';
import { selectSubscriptionPlan } from '../../../../api/organization-api';
import {
  BottomButtonContainer,
  StyledButton,
} from '../SubscriptionsView.Styled';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';
import { H2 } from './SubscriptionsPlansView.Styled';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';

const onSubscriptionPlanChosen = ({
  chosenPlan,
  organizationId,
  billingFrequency,
}) => () => {
  const { subscriptionPlan } = chosenPlan || {};

  if (subscriptionPlan) {
    selectSubscriptionPlan({
      organizationId,
      subscriptionPlan,
      billingFrequency,
    });
  }
};

const SubscriptionsPlansView = ({
  organizationId,
  hideSubscriptionPlans,
  isCancelVisible,
}) => {
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );

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
            <H2>Cancel</H2>
          </StyledButton>
        )}
        <StyledButton
          disabled={!chosenPlan}
          variant="contained"
          onClick={onSubscriptionPlanChosen({
            annualPayment,
            billingFrequency: annualPayment
              ? BILLING_FREQUENCY.ANNUAL
              : BILLING_FREQUENCY.MONTHLY,
            chosenPlan,
            organizationId,
          })}
        >
          <H2>Buy this plan</H2>
        </StyledButton>
      </BottomButtonContainer>
    </>
  );
};

export default SubscriptionsPlansView;
