import { times } from 'ramda';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useToggle } from 'react-use';

import { setHeader } from '../../../actions/header-actions';
import InvitationPanel from './SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from './SubscriptionsView.MembersTable';
import {
  BillingContainer,
  BillingLabel,
  BillingPrice,
  BottomButtonContainer,
  StyledButton,
  SubscriptionsViewContainer,
  Title,
} from './SubscriptionsView.Styled';
import PlanCardsContainer from './SubscriptionsView.PlanCardsContainer';
import {
  subscriptionFeatures,
  subscriptionPlanData,
} from './SubscriptionsView.PlanData';
import CurrentPlan from './SubscriptionsView.CurrentPlan';

const PRICE_ROUNDING_MODIFIER = 100;

const PLAN_CARDS_ENABLED = false;

export default () => {
  const dispatch = useDispatch();
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const featureRowReferences = times(
    () => useRef(null),
    subscriptionFeatures.length,
  );

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

  const getTotalPrice = useCallback(() => {
    const chosenPlanData = subscriptionPlanData.find(
      ({ key }) => key === chosenPlan,
    );

    const price = annualPayment
      ? chosenPlanData?.annualMonthlyPrice
      : chosenPlanData?.monthlyPrice;

    return (
      Math.floor(
        PRICE_ROUNDING_MODIFIER * selectedUsers.length * (price ?? 0),
      ) / PRICE_ROUNDING_MODIFIER
    );
  }, [annualPayment, chosenPlan, selectedUsers.length]);

  return (
    <SubscriptionsViewContainer container>
      <CurrentPlan />
      {PLAN_CARDS_ENABLED && (
        <PlanCardsContainer
          toggleAnnualPayment={toggleAnnualPayment}
          toggleFeatureListExpanded={toggleFeatureListExpanded}
          featureListExpanded={featureListExpanded}
          featureRowReferences={featureRowReferences}
          annualPayment={annualPayment}
          setChosenPlan={setChosenPlan}
          chosenPlan={chosenPlan}
        />
      )}
      <SubscriptionsViewMembersTable
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <InvitationPanel />
      <BillingContainer>
        <BillingLabel>Billed monthly on first day of each month</BillingLabel>
        <BillingPrice>${getTotalPrice()}</BillingPrice>
      </BillingContainer>
      <BottomButtonContainer container justify="flex-end">
        <StyledButton type="button" variant="text">
          Cancel
        </StyledButton>
        <StyledButton type="submit" variant="contained">
          Buy this plan
        </StyledButton>
      </BottomButtonContainer>
    </SubscriptionsViewContainer>
  );
};
