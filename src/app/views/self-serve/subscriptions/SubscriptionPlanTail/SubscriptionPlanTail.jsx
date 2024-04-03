import { Box } from '@mui/material';
import {
  BillingFrequency,
  SubscriptionPlan,
} from 'helpers/subscription-helper';
import React from 'react';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import {
  Container,
  MostPopularText,
  TopContainer,
  Name,
  Description,
  PriceContainer,
  Price,
  SubscribeButton,
  FeatureText,
  CheckIcon,
  MostPopularTextWrapper,
  DisclaimerText,
  PlanDescription,
  PlanDescriptionContainer,
} from './styled';
import SubscriptionPlanFeature from '../SubscriptionPlanFeature/SubscriptionPlanFeature';

const SubscriptionPlanTail = (props) => {
  const {
    active,
    selected,
    plan,
    hasExistingSubscription,
    onSelect,
    billingFrequency,
  } = props;
  const {
    key,
    mostPopular,
    label,
    description,
    annualMonthlyPrice,
    monthlyPrice,
    monthlyPlanDescriptions,
    annualPlanDescriptions,
    featuresDescription,
    features,
    comingSoonFeatures,
    disclaimers,
    subscriptionPlan,
  } = plan;

  const upgradeLabel =
    subscriptionPlan === SubscriptionPlan.STANDARD ? 'Change' : 'Upgrade';
  const subscribeLabel = hasExistingSubscription ? upgradeLabel : 'Subscribe';
  const price =
    billingFrequency === BillingFrequency.MONTHLY
      ? monthlyPrice
      : annualMonthlyPrice;
  const planDescriptions =
    (billingFrequency === BillingFrequency.MONTHLY
      ? monthlyPlanDescriptions
      : annualPlanDescriptions) ?? plan.planDescriptions;

  return (
    <Container
      active={active}
      pro={key === SubscriptionPlan.PRO && !hasExistingSubscription}
    >
      <TopContainer>
        <Name>{label}</Name>
        {mostPopular && (
          <MostPopularTextWrapper>
            <MostPopularText>Most Popular</MostPopularText>
          </MostPopularTextWrapper>
        )}
      </TopContainer>
      <Description>{description}</Description>
      <PriceContainer>
        <Price color={palette.black}>{price ? `$${price}` : 'Custom'}</Price>
      </PriceContainer>
      <PlanDescriptionContainer>
        {planDescriptions?.map((d) => (
          <PlanDescription key={d}>{d}</PlanDescription>
        ))}
      </PlanDescriptionContainer>
      {price ? (
        <SubscribeButton
          type="button"
          active={active}
          disabled={active}
          onClick={() => onSelect(subscriptionPlan)}
        >
          {!active && selected && <CheckIcon />}
          <Box component="span" position="relative">
            {active ? 'Active' : subscribeLabel}
          </Box>
        </SubscribeButton>
      ) : (
        <SubscribeButton
          type="button"
          pro={key === SubscriptionPlan.PRO && !hasExistingSubscription}
          disabled={active}
          onClick={() => {
            window.Intercom('show');
          }}
        >
          Contact Us
        </SubscribeButton>
      )}
      <FeatureText>{featuresDescription}</FeatureText>
      <Box m={2} />
      {features.map((feature) => (
        <SubscriptionPlanFeature key={feature} feature={feature} />
      ))}
      {comingSoonFeatures?.map((feature) => (
        <SubscriptionPlanFeature comingSoon feature={feature} />
      ))}
      <Spacing vertical={1} />
      {disclaimers?.map((disclaimer) => (
        <DisclaimerText key={disclaimer}>{disclaimer}</DisclaimerText>
      ))}
    </Container>
  );
};

export default SubscriptionPlanTail;
