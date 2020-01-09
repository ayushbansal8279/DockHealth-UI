import Grid from '@material-ui/core/Grid';
import { AnimatePresence, motion } from 'framer-motion';
import { times } from 'ramda';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useToggle } from 'react-use';

import { setHeader } from '../../actions/header-actions';
import FeatureListChevronIcon from '../../img/feature-list-chevron.svg';
import SubscriptionsViewPlanCard, {
  CARD_TYPES,
} from './SubscriptionsView.PlanCard';
import {
  AnnualToggleContainer,
  AnnualToggleLabel,
  AnnualToggleSwitch,
  FeatureListChevronContainer,
  FeatureListContainer,
  FeatureListContentHeader,
  FeatureListHeader,
  FeatureRow,
  H1,
  H2,
  H4,
  H4Animated,
  SubscriptionCardGrid,
  SubscriptionsViewContainer,
  Title,
} from './SubscriptionsView.Styled';

const subscriptionPlanData = [
  {
    key: 'standard',
    planLabel: 'Standard',
    inactiveBackgroundColor: '#DEDEE2',
    annualMonthlyPrice: 14.25,
    monthlyPrice: 19,
    cardType: CARD_TYPES.STANDARD,
  },
  {
    key: 'premium',
    planLabel: 'Premium',
    inactiveBackgroundColor: '#C8C8CE',
    annualMonthlyPrice: 18,
    monthlyPrice: 24,
    cardType: CARD_TYPES.PREMIUM,
    recommended: true,
  },
  {
    key: 'enterprise',
    planLabel: 'Enterprise',
    inactiveBackgroundColor: '#DEDEE2',
    cardType: CARD_TYPES.ENTERPRISE,
  },
];

const subscriptionFeatures = [
  {
    key: 'create-tasks',
    label: 'Create tasks with patient context',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'add-subtasks',
    label: 'Add subtasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'team-commenting',
    label: 'Team commenting',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'assign-tasks',
    label: 'Assign/reassign tasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'due-dates',
    label: 'Add due dates',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'task-flag-status',
    label: 'Flag & set task status',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'duplicate-tasks',
    label: 'Duplicate tasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'multiple-lists',
    label: 'Create multiple lists',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'history-of-events',
    label: 'View history of events',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'email-forwarding',
    label: 'Forward email to your task lists',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'attachments',
    label: 'Add attachments',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'tags',
    label: 'Customizable tags',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'ehr-integration',
    label: 'EHR integration',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-email',
    label: 'Custom email addresses',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-scripts',
    label: 'Custom email scripts/integrations',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'upload-patient-profiles',
    label: 'Uploading of patient profiles',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-protocols',
    label: 'Custom protocols',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'automations-workflows',
    label: 'Event/order driven automations & workflows',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
];

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

const renderSubscriptionFeature = ({ featureRowReferences }) => (
  { key, label },
  index,
) => (
  <FeatureRow key={key} ref={featureRowReferences[index]}>
    <H4>{label}</H4>
  </FeatureRow>
);

export default () => {
  const dispatch = useDispatch();
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState('');
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

  const featureListHeight = featureRowReferences.reduce(
    (accumulator, reference) =>
      accumulator + reference.current?.offsetHeight ?? 0,
    0,
  );

  return (
    <SubscriptionsViewContainer container>
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
          <motion.div
            {...animationProperties({
              featureListExpanded,
              height: featureListHeight,
            })}
          >
            {subscriptionFeatures.map(
              renderSubscriptionFeature({ featureRowReferences }),
            )}
          </motion.div>
        </FeatureListContainer>
        {subscriptionPlanData.map(
          renderPlanCard({
            annualPayment,
            setChosenPlan,
            chosenPlan,
            featureListExpanded,
            featureRowReferences,
          }),
        )}
      </SubscriptionCardGrid>
    </SubscriptionsViewContainer>
  );
};
