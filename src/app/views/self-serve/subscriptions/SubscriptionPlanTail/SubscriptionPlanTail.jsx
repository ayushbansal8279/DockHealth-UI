import { Box } from '@mui/material';
import { SubscriptionPlan } from 'helpers/subscription-helper';
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
  const { active, selected, plan, hasExistingSubscription, onSelect } = props;
  const {
    key,
    mostPopular,
    label,
    description,
    planDescriptions,
    annualMonthlyPrice,
    buttonBackgroundColor,
    featuresDescription,
    features,
    comingSoonFeatures,
    disclaimers,
    subscriptionPlan,
  } = plan;

  const upgradeLabel =
    subscriptionPlan === SubscriptionPlan.STANDARD ? 'Change' : 'Upgrade';
  const subscribeLabel = hasExistingSubscription ? upgradeLabel : 'Subscribe';

  return (
    <Container isPro={key === SubscriptionPlan.PRO}>
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
        <Price color={palette.black}>
          {annualMonthlyPrice ? `$${annualMonthlyPrice}` : 'Custom'}
        </Price>
      </PriceContainer>
      <PlanDescriptionContainer>
        {planDescriptions?.map((d) => (
          <PlanDescription key={d}>{d}</PlanDescription>
        ))}
      </PlanDescriptionContainer>
      {annualMonthlyPrice ? (
        <SubscribeButton
          type="button"
          active={active}
          backgroundColor={buttonBackgroundColor}
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
          backgroundColor={buttonBackgroundColor}
          disabled={active}
          onClick={() => {
            window.Intercom('show');
          }}
        >
          {key === SubscriptionPlan.PRO ? 'Schedule a demo' : 'Contact Us'}
        </SubscribeButton>
      )}
      {/* {(annualMonthlyPrice || monthlyPrice) &&
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
      )} */}
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
