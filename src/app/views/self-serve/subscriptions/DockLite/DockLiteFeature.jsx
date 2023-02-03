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
  Divider,
  UnitContainer,
  UnitText,
  FeatureText,
} from './styled';

import SubscriptionPlanFeature from '../SubscriptionPlanFeature/SubscriptionPlanFeature';

const DockLiteFeature = props => {
  const { plan, billingFrequency } = props;
  const {
    key,
    mostPopular,
    color,
    label,
    description,
    annualMonthlyPrice,
    monthlyPrice,
    featuresDescription,
    features,
    comingSoonFeatures,
  } = plan;

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
                <UnitText>month</UnitText>
                {key === SubscriptionPlan.ENTERPRISE && (
                  <UnitText>+ Pro per user</UnitText>
                )}
              </div>
            </UnitContainer>
          </>
        )}
      </PriceContainer>
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

export default DockLiteFeature;
