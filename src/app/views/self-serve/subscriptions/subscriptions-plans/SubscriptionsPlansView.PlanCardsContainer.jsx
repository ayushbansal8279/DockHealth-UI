import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import FeatureListChevronIcon from '../../../../img/feature-list-chevron.svg';
import { H1, H2, H4 } from '../SubscriptionsView.Styled';
import SubscriptionsViewPlanCard from './SubscriptionsPlansView.PlanCard';
import {
  AnnualToggleContainer,
  AnnualToggleLabel,
  AnnualToggleSwitch,
  FeatureListChevronContainer,
  FeatureListContentHeader,
  FeatureListHeader,
  FeatureListInnerContainer,
  FeatureRow,
  FeatureRowsContainer,
  SubscriptionCardGrid,
} from './SubscriptionsPlansView.PlanCardsContainer.Styled';
import {
  subscriptionFeatures,
  subscriptionPlanData,
} from './SubscriptionsPlansView.PlanData';

const renderPlanCard = ({
  annualPayment,
  setChosenPlan,
  chosenPlan,
  featureListExpanded,
  featureRowReferences,
  changeSubscriptionPlan,
}) => ({ key, selectable = true, ...props }) => {
  const chosen = chosenPlan?.key === key;
  const newChosenPlan = subscriptionPlanData.find(
    ({ key: planKey }) => key === planKey,
  );

  const onClick = selectable
    ? () => {
        setChosenPlan(newChosenPlan);
        changeSubscriptionPlan({
          subscriptionPlan: newChosenPlan?.subscriptionPlan,
        });
      }
    : undefined;

  return (
    <SubscriptionsViewPlanCard
      key={key}
      annualPayment={annualPayment}
      chosen={chosen}
      onClick={onClick}
      featureListExpanded={featureListExpanded}
      featureRowReferences={featureRowReferences}
      subscriptionFeatures={subscriptionFeatures}
      selectable={selectable}
      {...props}
    />
  );
};

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
  changeSubscriptionPlan,
}) => {
  return (
    <Grid container>
      <Grid item md={9} sm={12}>
        <H1>Select the plan that’s right for you</H1>
        <H2>Get the features your team needs to succeed</H2>
      </Grid>
      <Grid
        item
        md={3}
        sm={12}
        container
        justify="flex-start"
        alignItems="center"
      >
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
      <SubscriptionCardGrid item xs={12} container direction="row" spacing={8}>
        <Hidden mdDown>
          <Grid item xs={3} container direction="column">
            <FeatureListInnerContainer>
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
                <Collapse in={featureListExpanded}>
                  <H4>iPhone App & Web</H4>
                </Collapse>
              </FeatureListContentHeader>
              <FeatureRowsContainer>
                <Collapse in={featureListExpanded}>
                  {subscriptionFeatures.map(
                    renderSubscriptionFeature({
                      featureListExpanded,
                      featureRowReferences,
                    }),
                  )}
                </Collapse>
              </FeatureRowsContainer>
            </FeatureListInnerContainer>
          </Grid>
        </Hidden>
        {subscriptionPlanData.map(
          renderPlanCard({
            annualPayment,
            setChosenPlan,
            chosenPlan,
            featureListExpanded,
            featureRowReferences,
            subscriptionFeatures,
            changeSubscriptionPlan,
          }),
        )}
      </SubscriptionCardGrid>
    </Grid>
  );
};

export default PlanCardsContainer;
