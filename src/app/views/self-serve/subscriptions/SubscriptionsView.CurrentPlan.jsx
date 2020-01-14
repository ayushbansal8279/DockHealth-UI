import React from 'react';

import {
  PlanColumnBottomExpandedLabel,
  PlanColumnBottomLabel,
  PlanColumnBottomLabelFlexStart,
  PlanColumnContainer,
  PlanColumnExpandedContainer,
  PlanColumnTopExpandedLabel,
  PlanColumnTopLabel,
  PlanColumnTopLabelFlexEnd,
  PlanContainer,
  PlanNameLabel,
  PlanColumnLink,
} from './SubscriptionsView.CurrentPlan.Styled';
import {
  BigPriceLabel,
  H1Bold,
  H3Marginless,
  H3ThinMarginless,
  PriceLabel,
} from './SubscriptionsView.Styled';

const CurrentPlan = () => {
  return (
    <PlanContainer>
      <PlanColumnContainer>
        <PlanColumnTopLabel>
          <PlanNameLabel>Standard</PlanNameLabel>
        </PlanColumnTopLabel>
        <PlanColumnBottomLabel>
          <H1Bold>$57</H1Bold>
        </PlanColumnBottomLabel>
      </PlanColumnContainer>
      <PlanColumnExpandedContainer>
        <PlanColumnTopExpandedLabel>
          <div>
            <BigPriceLabel>$19</BigPriceLabel>
            <PriceLabel>/user</PriceLabel>
          </div>
          <H3ThinMarginless>Monthly subscription</H3ThinMarginless>
        </PlanColumnTopExpandedLabel>
        <PlanColumnBottomExpandedLabel>
          <H3Marginless>Your next payment</H3Marginless>
          <H3ThinMarginless>charged on 01/01/2020</H3ThinMarginless>
        </PlanColumnBottomExpandedLabel>
      </PlanColumnExpandedContainer>
      <PlanColumnContainer>
        <PlanColumnTopLabelFlexEnd>
          <PlanColumnLink to="">Change plans</PlanColumnLink>
        </PlanColumnTopLabelFlexEnd>
        <PlanColumnBottomLabelFlexStart>
          <PlanColumnLink to="">View billings</PlanColumnLink>
        </PlanColumnBottomLabelFlexStart>
      </PlanColumnContainer>
    </PlanContainer>
  );
};

export default CurrentPlan;
