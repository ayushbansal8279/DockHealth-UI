import { Box } from '@material-ui/core';
import {
  BillingFrequency,
  SubscriptionPlan,
} from 'helpers/subscription-helper';
import React from 'react';
import {
  Container,
  MostPopularText,
  TopContainer,
  Name,
  Description,
  PriceContainer,
  Price,
  SubscribeButton,
  Divider,
  UnitContainer,
  UnitText,
  FeatureText,
  ContactUsAnchor,
  CheckIcon,
} from './styled';
import SubscriptionPlanFeature from '../SubscriptionPlanFeature/SubscriptionPlanFeature';

const SubscriptionPlanTail = props => {
  const {
    active,
    selected,
    plan,
    hasExistingSubscription,
    billingFrequency,
    onSelect,
  } = props;
  const {
    mostPopular,
    color,
    label,
    description,
    annualMonthlyPrice,
    monthlyPrice,
    featuresDescription,
    features,
    comingSoonFeatures,
    subscriptionPlan,
  } = plan;

  const upgradeLabel =
    plan?.subscriptionPlan === SubscriptionPlan.STANDARD ? 'Change' : 'Upgrade';
  const subscribeLabel = hasExistingSubscription ? upgradeLabel : 'Subscribe';

  return (
    <Container color={color}>
      <TopContainer>
        {mostPopular && <MostPopularText>Most Popular</MostPopularText>}
        <Name color={color}>{label}</Name>
        <Description>{description}</Description>
      </TopContainer>
      <PriceContainer>
        {(annualMonthlyPrice || monthlyPrice) && (
          <>
            <Price color={color}>
              $
              {billingFrequency === BillingFrequency.ANNUAL
                ? annualMonthlyPrice
                : monthlyPrice}
            </Price>
            <UnitContainer>
              /
              <Box m={0.2} />
              <div>
                <UnitText>user</UnitText>
                <UnitText>mo</UnitText>
              </div>
            </UnitContainer>
          </>
        )}
      </PriceContainer>
      {annualMonthlyPrice || monthlyPrice ? (
        <SubscribeButton
          type="button"
          active={active}
          color={color}
          disabled={active}
          onClick={() => onSelect(subscriptionPlan)}
        >
          <Box component="span" position="relative">
            {!active && selected && <CheckIcon />}
            {active ? 'Active' : subscribeLabel}
          </Box>
        </SubscribeButton>
      ) : (
        <ContactUsAnchor
          color={color}
          onClick={() => {
            window.Intercom('show');
          }}
        >
          Contact Us
        </ContactUsAnchor>
      )}
      <Divider />
      <FeatureText>{featuresDescription}</FeatureText>
      <Box m={2} />
      {features.map(feature => (
        <SubscriptionPlanFeature feature={feature} />
      ))}
      {comingSoonFeatures?.map(feature => (
        <SubscriptionPlanFeature comingSoon feature={feature} />
      ))}
    </Container>
  );
};

export default SubscriptionPlanTail;
