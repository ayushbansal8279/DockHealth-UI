import { times } from 'ramda';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useToggle } from 'react-use';

import { setHeader } from '../../../actions/header-actions';
import {
  BottomButtonContainer,
  StyledButton,
} from '../subscriptions/SubscriptionsView.Styled';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';
import {
  SubscriptionsPlansViewContainer,
  Title,
  H2,
} from './SubscriptionsPlansView.Styled';
import { selectSubscriptionPlan } from '../../../actions/organization-actions';

const onSubscriptionPlanChosen = ({ chosenPlan, dispatch }) => () => {
  const { planType } = chosenPlan || {};

  if (planType) {
    selectSubscriptionPlan({ planType })(dispatch);
  }
};

const SubscriptionsPlansView = () => {
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState(null);
  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Subscription & Users</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });
  });

  return (
    <SubscriptionsPlansViewContainer>
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
        <StyledButton
          disabled={!chosenPlan}
          variant="contained"
          onClick={onSubscriptionPlanChosen({
            annualPayment,
            chosenPlan,
            dispatch,
          })}
        >
          <H2>Buy this plan</H2>
        </StyledButton>
      </BottomButtonContainer>
    </SubscriptionsPlansViewContainer>
  );
};

export default SubscriptionsPlansView;
