import Grid from '@material-ui/core/Grid';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import FeatureListChevronIcon from '../../../img/feature-list-chevron.svg';
import SubscriptionsViewPlanCard from './SubscriptionsView.PlanCard';
import {
  AnnualToggleContainer,
  AnnualToggleLabel,
  AnnualToggleSwitch,
  FeatureListChevronContainer,
  FeatureListContainer,
  FeatureListContentHeader,
  FeatureListHeader,
  FeatureRow,
  FeatureRowsContainer,
  SubscriptionCardGrid,
} from './SubscriptionsView.PlanCardsContainer.Styled';
import {
  subscriptionFeatures,
  subscriptionPlanData,
} from './SubscriptionsView.PlanData';
import { H1, H2, H4, H4Animated } from './SubscriptionsView.Styled';

const renderPlanCard = ({
  annualPayment,
  setChosenPlan,
  chosenPlan,
  featureListExpanded,
  featureRowReferences,
}) => ({ key, ...props }) => {
  const chosen = chosenPlan === key;

  return (
    <SubscriptionsViewPlanCard
      key={key}
      annualPayment={annualPayment}
      chosen={chosen}
      onClick={() => setChosenPlan(key)}
      featureListExpanded={featureListExpanded}
      featureRowReferences={featureRowReferences}
      subscriptionFeatures={subscriptionFeatures}
      {...props}
    />
  );
};

const animationProperties = ({ featureListExpanded, height }) => ({
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height,
      opacity: 1,
    },
  },
  animate: featureListExpanded ? 'visible' : 'hidden',
  initial: 'hidden',
  exit: 'hidden',
  transition: { ease: 'easeInOut', duration: 0.25 },
});

const renderSubscriptionFeature = ({
  featureListExpanded,
  featureRowReferences,
}) => ({ key, label }, index) => (
  <FeatureRow
    key={key}
    open={featureListExpanded}
    ref={featureRowReferences[index]}
  >
    <H4>{label}</H4>
  </FeatureRow>
);

const PlanCardsContainer = ({
  toggleFeatureListExpanded,
  featureListExpanded,
  featureRowReferences,
  annualPayment,
  setChosenPlan,
  chosenPlan,
  toggleAnnualPayment,
}) => {
  const featureListHeight = featureRowReferences.reduce(
    (accumulator, reference) =>
      accumulator + reference.current?.offsetHeight ?? 0,
    0,
  );

  return (
    <>
      <Grid item md={9} sm={12}>
        <H1>Select the plan that’s right for you</H1>
        <H2>Get the features your team needs to succeed</H2>
      </Grid>
      <Grid item md={3} sm={12} container justify="center" alignItems="center">
        <Grid item md={12} sm={6} container justify="center">
          <H4>Save 25% by paying annually</H4>
          <AnnualToggleContainer
            item
            xs={12}
            container
            onClick={toggleAnnualPayment}
          >
            <Grid item xs={6} container justify="center" alignItems="center">
              <AnnualToggleLabel active={annualPayment}>
                Annually
              </AnnualToggleLabel>
            </Grid>
            <Grid item xs={6} container justify="center" alignItems="center">
              <AnnualToggleLabel active={!annualPayment}>
                Monthly
              </AnnualToggleLabel>
            </Grid>
            <AnnualToggleSwitch active={!annualPayment} />
          </AnnualToggleContainer>
        </Grid>
      </Grid>
      <SubscriptionCardGrid
        item
        xs={12}
        container
        direction="row"
        wrap="nowrap"
      >
        <FeatureListContainer>
          <FeatureListHeader>
            <H2>Features</H2>
          </FeatureListHeader>
          <FeatureListContentHeader onClick={toggleFeatureListExpanded}>
            <H4>
              <span>{`${
                featureListExpanded ? 'Hide' : 'Show'
              } all features`}</span>
              <FeatureListChevronContainer
                alt="chevron icon"
                src={FeatureListChevronIcon}
                rotated={!featureListExpanded}
              />
            </H4>
            <AnimatePresence>
              {featureListExpanded && (
                <H4Animated
                  {...animationProperties({
                    featureListExpanded,
                    height: '0.875rem',
                  })}
                >
                  iPhone App & Web
                </H4Animated>
              )}
            </AnimatePresence>
          </FeatureListContentHeader>
          <FeatureRowsContainer
            {...animationProperties({
              featureListExpanded,
              height: featureListHeight,
            })}
            open={featureListExpanded}
          >
            {subscriptionFeatures.map(
              renderSubscriptionFeature({
                featureListExpanded,
                featureRowReferences,
              }),
            )}
          </FeatureRowsContainer>
        </FeatureListContainer>
        {subscriptionPlanData.map(
          renderPlanCard({
            annualPayment,
            setChosenPlan,
            chosenPlan,
            featureListExpanded,
            featureRowReferences,
            subscriptionFeatures,
          }),
        )}
      </SubscriptionCardGrid>
    </>
  );
};

export default PlanCardsContainer;
