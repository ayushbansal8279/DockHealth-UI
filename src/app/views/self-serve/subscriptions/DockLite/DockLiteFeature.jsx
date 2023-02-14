import { Box, Grid } from '@material-ui/core';
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
  ContactUsAnchor,
  LeftContainer,
  Title,
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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <LeftContainer>
          <TopContainer>
            <Title>
              Seamless interconnectivity to outside collaborators and colleagues{' '}
            </Title>
          </TopContainer>
          <Box m={2} />
          <Description>
            Add Dock Lite users to bring outside/external care-team members
            without the friction of disparate technologies and systems. From
            streamlining referrals to care coordination to more efficient
            billing processes, Dock Lite powers last-mile secure collaboration
            throughout the patient journey.
          </Description>
          <Box m={4} />
          <ContactUsAnchor
            color="#0e244a"
            onClick={() => {
              window.Intercom('show');
            }}
          >
            Questions?
          </ContactUsAnchor>
        </LeftContainer>
      </Grid>
      <Grid item xs={6}>
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
          <Box m={0.5} />
          {features.map(feature => (
            <SubscriptionPlanFeature feature={feature} />
          ))}
          {comingSoonFeatures?.map(feature => (
            <SubscriptionPlanFeature comingSoon feature={feature} />
          ))}
        </Container>
      </Grid>
    </Grid>
  );
};

export default DockLiteFeature;
