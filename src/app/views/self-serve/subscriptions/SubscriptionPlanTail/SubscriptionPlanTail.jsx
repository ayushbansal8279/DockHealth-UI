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
  NewText,
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

const SubscriptionPlanTail = (props) => {
  const {
    active,
    selected,
    plan,
    hasExistingSubscription,
    billingFrequency,
    onSelect,
  } = props;
  const {
    key,
    mostPopular,
    showNewHeader,
    color,
    label,
    description,
    annualMonthlyPrice,
    monthlyPrice,
    featuresDescription,
    features,
    comingSoonFeatures,
    disclaimers,
    subscriptionPlan,
  } = plan;

  const upgradeLabel = 'Change';
  const subscribeLabel = hasExistingSubscription ? upgradeLabel : 'Subscribe';

  return (
    <Container color={color}>
      <TopContainer>
        {mostPopular && <MostPopularText>Most Popular</MostPopularText>}
        {showNewHeader && <NewText>New</NewText>}
        <Name color={color}>{label}</Name>
        <Description>{description}</Description>
      </TopContainer>
      <PriceContainer>
        {(annualMonthlyPrice || monthlyPrice) && (
          <>
            <Price color="#000000">
              $
              {billingFrequency === BillingFrequency.ANNUAL
                ? annualMonthlyPrice
                : monthlyPrice}
            </Price>
            <UnitContainer>
              /
              <Box m={0.2} />
              <div>
                {key === SubscriptionPlan.ENTERPRISE ? (
                  <>
                    <UnitText>month</UnitText>
                    <UnitText>+ Pro per user</UnitText>
                  </>
                ) : (
                  <>
                    <UnitText>user</UnitText>
                    <UnitText>month</UnitText>
                  </>
                )}
              </div>
            </UnitContainer>
          </>
        )}
      </PriceContainer>
      {(annualMonthlyPrice || monthlyPrice) &&
      key !== SubscriptionPlan.ENTERPRISE ? (
        <SubscribeButton
          type="button"
          active={active}
          color={palette.newDarkBlue}
          disabled={active}
          onClick={() => onSelect(subscriptionPlan)}
        >
          {!active && selected && <CheckIcon />}
          <Box component="span" position="relative">
            {active ? 'Active' : subscribeLabel}
          </Box>
        </SubscribeButton>
      ) : (
        <ContactUsAnchor
          color={palette.newDarkBlue}
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
      {features.map((feature) => (
        <SubscriptionPlanFeature feature={feature} />
      ))}
      {comingSoonFeatures?.map((feature) => (
        <SubscriptionPlanFeature comingSoon feature={feature} />
      ))}
      <Spacing vertical={1} />
      {disclaimers?.map((disclaimer) => (
        <FeatureText>{disclaimer}</FeatureText>
      ))}
    </Container>
  );
};

export default SubscriptionPlanTail;
