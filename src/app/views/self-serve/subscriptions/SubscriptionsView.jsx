import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import usePrevious from 'hooks/use-previous';
import { equals } from 'ramda';
import {
  BillingFrequency,
  SUBSCRIPTION_PLANS,
  isPlanTrial,
  priceFormatter,
  PROFESSIONAL_SERVICES_PRICE,
} from 'helpers/subscription-helper';
import {
  getBillingEstimate,
  setPaymentNewPlan,
  updateSubscriptionDetails,
} from 'actions/organization-actions';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import Button from 'components/common/Button/Button';
import {
  currentSubscriptionPlanSelector,
  isSavingNewPlanSelector,
} from 'selectors/organization-selectors';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import CurrentPlan from './CurrentPlan/CurrentPlan';
import SubscriptionPlanTail from './SubscriptionPlanTail/SubscriptionPlanTail';
import ProfessionalServicesTail from './ProfessionalServicesTail/ProfessionalServicesTail';
import {
  SubscriptionsViewContainer,
  SubscriptionsViewOuterContainer,
  SubscriptionPlansContainer,
  SubscriptionsTitle,
  SwitchContainer,
  Switch,
  SwitchLabel,
  ProfessionalServicesTitle,
  Title,
  TitleDescription,
  SubTitleDescription,
  BillingTable,
  BillingTableHeaderRow,
  BillingTableRow,
  BillingTableHeaderCell,
  BillingTableCell,
  BillingTableSummaryRow,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const SubscriptionsView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const scrollReference = useRef(null);
  const [selectedBillingFrequency, setSelectedBillingFrequency] = useState(
    BillingFrequency.ANNUAL,
  );
  const [
    selectedProfessionalServices,
    setSelectedProfessionalServices,
  ] = useState(BillingFrequency.ANNUAL);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const currentUser = useSelector(userProfileSelector);
  const isSavingNewPlan = useSelector(isSavingNewPlanSelector);
  const currentSubscriptionPlan = useSelector(currentSubscriptionPlanSelector);
  const { activeUserCount, subscriptionDetails } =
    currentSubscriptionPlan || {};
  const { subscriptionPlan, billingFrequency, professionalServicesIncluded } =
    subscriptionDetails || {};

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Subscriptions</GenericHeader>,
            alignItems: 'center',
          },
        ],
      }),
    );

    dispatch(getBillingEstimate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (billingFrequency) setSelectedBillingFrequency(billingFrequency);
  }, [billingFrequency]);

  useEffect(() => {
    setSelectedProfessionalServices(professionalServicesIncluded);
  }, [professionalServicesIncluded]);

  useEffect(() => {
    setSelectedPlan(subscriptionPlan);
  }, [subscriptionPlan]);

  const previousSubscriptionDetails = usePrevious(subscriptionDetails);

  useEffect(() => {
    if (
      previousSubscriptionDetails &&
      subscriptionDetails &&
      !equals(subscriptionDetails, previousSubscriptionDetails)
    )
      history.push('subscription-payment-finished');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionDetails]);

  const selectedPlanDetails = SUBSCRIPTION_PLANS.find(
    ({ subscriptionPlan: sp }) => sp === selectedPlan,
  );

  const isCurrentPlanChanged =
    isPlanTrial(subscriptionDetails) ||
    selectedBillingFrequency !== billingFrequency ||
    professionalServicesIncluded !== selectedProfessionalServices ||
    subscriptionPlan !== selectedPlan;

  const includeProfessionalServices =
    !professionalServicesIncluded && selectedProfessionalServices;

  const getTotalPrice = () => {
    let price = 0;

    price +=
      activeUserCount *
      (selectedBillingFrequency === BillingFrequency.ANNUAL
        ? selectedPlanDetails?.annualMonthlyPrice * 12
        : selectedPlanDetails?.monthlyPrice || 0);

    if (includeProfessionalServices) {
      price += PROFESSIONAL_SERVICES_PRICE;
    }

    return price;
  };

  const handleSubscriptionPlanBuy = () => {
    const newPlan = {
      billingFrequency: selectedBillingFrequency,
      subscriptionPlan: selectedPlan,
    };

    if (!professionalServicesIncluded) {
      newPlan.professionalServicesIncluded = selectedProfessionalServices;
    }

    if (isPlanTrial(subscriptionDetails)) {
      dispatch(
        setPaymentNewPlan({
          newPlan,
        }),
      );
      history.push('/subscription-payment');
    } else {
      dispatch(updateSubscriptionDetails(newPlan));
    }
  };

  const hasExistingSubscription = !currentSubscriptionPlan?.subscriptionDetails
    ?.trialEndDate;

  return (
    <SubscriptionsViewOuterContainer>
      <SubscriptionsViewContainer>
        {currentSubscriptionPlan && (
          <CurrentPlan currentSubscriptionPlan={currentSubscriptionPlan} />
        )}
        <Box p={2} />
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <SubscriptionsTitle>
            {hasExistingSubscription
              ? 'Available plans'
              : `Select the plan that's right for you`}
          </SubscriptionsTitle>
          <SwitchContainer>
            <SwitchLabel
              active={selectedBillingFrequency === BillingFrequency.ANNUAL}
            >
              Yearly
            </SwitchLabel>
            <Switch
              checked={selectedBillingFrequency === BillingFrequency.MONTHLY}
              onChange={event =>
                setSelectedBillingFrequency(
                  event.target.checked
                    ? BillingFrequency.MONTHLY
                    : BillingFrequency.ANNUAL,
                )
              }
            />
            <SwitchLabel
              active={selectedBillingFrequency === BillingFrequency.MONTHLY}
            >
              Monthly
            </SwitchLabel>
          </SwitchContainer>
        </Box>
        <Box p={1} />
        <SubscriptionPlansContainer>
          <Box display="flex" justifyContent="space-between">
            {SUBSCRIPTION_PLANS.map(plan => (
              <SubscriptionPlanTail
                key={plan.key}
                active={subscriptionPlan === plan.subscriptionPlan}
                selected={selectedPlan === plan.subscriptionPlan}
                plan={plan}
                hasExistingSubscription={hasExistingSubscription}
                billingFrequency={selectedBillingFrequency}
                onSelect={newPlan => {
                  if (newPlan === selectedPlan) {
                    setSelectedPlan(subscriptionPlan);
                  } else {
                    setSelectedPlan(newPlan);
                    scrollReference.current.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }
                }}
              />
            ))}
          </Box>
          {!professionalServicesIncluded && (
            <>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my={2}
              >
                <ProfessionalServicesTitle>
                  Include Professional Services:
                </ProfessionalServicesTitle>
                <SwitchContainer>
                  <SwitchLabel active={!selectedProfessionalServices}>
                    No
                  </SwitchLabel>
                  <Switch
                    checked={selectedProfessionalServices}
                    disabled={!selectedPlan || selectedPlan.includes('TRIAL')}
                    onChange={event =>
                      setSelectedProfessionalServices(event.target.checked)
                    }
                  />
                  <SwitchLabel active={selectedProfessionalServices}>
                    Yes
                  </SwitchLabel>
                </SwitchContainer>
              </Box>
              <ProfessionalServicesTail />
            </>
          )}
          <Box p={1} />
          <Title>
            Billing <SubTitleDescription>Est</SubTitleDescription>
          </Title>
          <Box p={1} />
          <BillingTable>
            <BillingTableHeaderRow>
              <BillingTableHeaderCell>Plan</BillingTableHeaderCell>
              <BillingTableHeaderCell>Count</BillingTableHeaderCell>
              <BillingTableHeaderCell>Cost</BillingTableHeaderCell>
            </BillingTableHeaderRow>
            <BillingTableRow>
              <BillingTableCell>
                {selectedBillingFrequency === BillingFrequency.ANNUAL
                  ? 'Annual'
                  : 'Monthly'}{' '}
                Plan
              </BillingTableCell>
              <BillingTableCell>{activeUserCount} users</BillingTableCell>
              <BillingTableCell>
                {priceFormatter(
                  selectedBillingFrequency === BillingFrequency.ANNUAL
                    ? selectedPlanDetails?.annualPrice
                    : selectedPlanDetails?.monthlyPrice,
                )}{' '}
                /{' '}
                {selectedBillingFrequency === BillingFrequency.ANNUAL
                  ? 'year'
                  : 'month'}
              </BillingTableCell>
            </BillingTableRow>
            {includeProfessionalServices && (
              <BillingTableRow>
                <BillingTableCell>Professional Services</BillingTableCell>
                <BillingTableCell />
                <BillingTableCell>
                  {priceFormatter(PROFESSIONAL_SERVICES_PRICE)} / one time
                </BillingTableCell>
              </BillingTableRow>
            )}
            <BillingTableSummaryRow>
              <BillingTableCell>
                <TitleDescription>Total</TitleDescription>{' '}
                <SubTitleDescription>Est</SubTitleDescription>
              </BillingTableCell>
              <BillingTableCell />
              <BillingTableCell>
                {priceFormatter(getTotalPrice())}
              </BillingTableCell>
            </BillingTableSummaryRow>
          </BillingTable>
          <Box p={1} />
          <Grid container justify="flex-end">
            {isCurrentPlanChanged && (
              <Button
                width="200px"
                disabled={isSavingNewPlan}
                onClick={handleSubscriptionPlanBuy}
              >
                {isPlanTrial(subscriptionDetails)
                  ? 'Buy this plan'
                  : 'Update plan'}
              </Button>
            )}
          </Grid>
          <div ref={scrollReference} />
        </SubscriptionPlansContainer>
      </SubscriptionsViewContainer>
    </SubscriptionsViewOuterContainer>
  );
};

export default SubscriptionsView;
