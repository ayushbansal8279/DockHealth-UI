import { Button } from '@material-ui/core';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { setPaymentNewPlan } from 'actions/organization-actions';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import SubscriptionsPlansView from './subscriptions-plans/SubscriptionsPlansView';
import CurrentPlan from './SubscriptionsView.CurrentPlan';
import initializeSubscriptionsViewHooks from './SubscriptionsView.Hooks';
import InvitationPanel from './SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from './SubscriptionsView.MembersTable';
import { USER_SUBSCRIPTION_STATUS } from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import {
  BillingContainer,
  BottomButtonContainer,
  SubscriptionsViewContainer,
  SubscriptionsViewOuterContainer,
} from './SubscriptionsView.Styled';
import {
  BILLING_FREQUENCY,
  getSubscriptionPlanData,
} from './SubscriptionsView.Utilities';

const goToSubscriptionPayment = () => {
  hashHistory.push('/subscription-payment');
};

const onSubscriptionPlanChosen = ({
  annualPayment,
  chosenPlan,
  dispatch,
}) => () => {
  const { subscriptionPlan } = chosenPlan || {};

  if (subscriptionPlan) {
    const newPlan = {
      ...chosenPlan,
      annualPayment,
    };

    setPaymentNewPlan({ newPlan })(dispatch);
    goToSubscriptionPayment();
  }
};

export default () => {
  const dispatch = useDispatch();
  const scrollElementReference = useRef(null);

  const {
    selectedUsers,
    subscriptionPlansVisible,
    showSubscriptionPlans,
    hideSubscriptionPlans,
    chosenPlan,
    setChosenPlan,
    currentPlan,
    setCurrentPlan,
    annualPayment,
    toggleAnnualPayment,
    setSelectedUsers,
    isOrganizationFetching,
    organizationRequestError,
    isFetchingBilling,
    requestErrorBilling,
    recalculateEstimate,
    getAllUsers,
    userSubscriptionStatus,
    setUserSubscriptionStatus,
    outerContainerReference,
    organization,
    organizationIdentifier,
    billingData,
  } = initializeSubscriptionsViewHooks({});

  const subscriptionPlanData = getSubscriptionPlanData({
    organization,
    billingData,
    chosenPlan,
    annualPayment,
    selectedUsers,
  });
  const plansViewVisible =
    subscriptionPlansVisible || subscriptionPlanData.planIsTrial;

  const buyButtonDisabled = !chosenPlan;

  const billingFrequency = annualPayment
    ? BILLING_FREQUENCY.ANNUAL
    : BILLING_FREQUENCY.MONTHLY;

  const billingVisible =
    userSubscriptionStatus !== USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED &&
    chosenPlan;

  const [invitationPanelVisible, toggleInvitationPanelVisibility] = useState(
    false,
  );

  const {
    annualMonthlyPrice: chosenAnnualMonthlyPrice,
    subscriptionPlan: chosenSubscriptionPlan,
    monthlyPrice: chosenMonthlyPrice,
  } = chosenPlan || {};

  const chosenTotalPerUserCost = annualPayment
    ? chosenAnnualMonthlyPrice
    : chosenMonthlyPrice;

  const currentUsersCount = selectedUsers?.length ?? 0;

  const chosenSubscriptionPlanData = getSubscriptionPlanData({
    organization: {
      subscriptionDetails: {
        subscriptionPlan: chosenSubscriptionPlan,
        billingFrequency,
      },
    },
    billingData: {
      monthlyPerUserCost: chosenTotalPerUserCost,
      monthlyEstimate: currentUsersCount * chosenTotalPerUserCost,
      annualEstimate: currentUsersCount * chosenTotalPerUserCost * 12,
    },
  });

  const memberTableSubscriptionData = chosenPlan
    ? chosenSubscriptionPlanData
    : subscriptionPlanData;

  return (
    <SubscriptionsViewOuterContainer ref={outerContainerReference}>
      <SubscriptionsViewContainer>
        {plansViewVisible ? (
          <SubscriptionsPlansView
            organization={organization}
            chosenPlan={chosenPlan}
            setChosenPlan={plan => {
              setChosenPlan(plan);
              // eslint-disable-next-line no-unused-expressions
              scrollElementReference?.current?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
            annualPayment={annualPayment}
            toggleAnnualPayment={toggleAnnualPayment}
            organizationIdentifier={organizationIdentifier}
            billingFrequency={billingFrequency}
            recalculateEstimate={recalculateEstimate}
            subscriptionPlanData={subscriptionPlanData}
          />
        ) : (
          <CurrentPlan
            isOrganizationFetching={isOrganizationFetching && isFetchingBilling}
            organizationRequestError={
              organizationRequestError || requestErrorBilling
            }
            subscriptionPlanData={subscriptionPlanData}
            showSubscriptionPlans={showSubscriptionPlans}
          />
        )}
        <SubscriptionsViewMembersTable
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          getAllUsers={getAllUsers}
          chosenSubscriptionPlan={chosenPlan}
          userSubscriptionStatus={userSubscriptionStatus}
          setUserSubscriptionStatus={setUserSubscriptionStatus}
          subscriptionPlanData={memberTableSubscriptionData}
          toggleInvitationPanelVisibility={toggleInvitationPanelVisibility}
          buyButtonDisabled={buyButtonDisabled}
          onClickBuyButton={onSubscriptionPlanChosen({
            annualPayment,
            chosenPlan,
            dispatch,
          })}
        />
        {invitationPanelVisible && (
          <InvitationPanel getAllUsers={getAllUsers} />
        )}
        {billingVisible && (
          <BillingContainer>
            <MontserratTypography variant="h4">
              {subscriptionPlanData.planBillingPeriod}
            </MontserratTypography>
            <MontserratTypography variant="h2" weight="bold">
              {subscriptionPlanData.planTotalPayment}
            </MontserratTypography>
          </BillingContainer>
        )}
        <BottomButtonContainer container justify="flex-end" wrap="nowrap">
          {plansViewVisible && chosenPlan && (
            <>
              {!subscriptionPlanData?.planIsTrial && (
                <Button
                  variant="text"
                  size="small"
                  onClick={hideSubscriptionPlans}
                >
                  Cancel
                </Button>
              )}
              <Spacing horizontal={4} />
              <Button
                disabled={buyButtonDisabled}
                variant="contained"
                size="small"
                onClick={onSubscriptionPlanChosen({
                  annualPayment,
                  chosenPlan,
                  dispatch,
                })}
              >
                Buy this plan
              </Button>
              <div ref={scrollElementReference} />
            </>
          )}
        </BottomButtonContainer>
      </SubscriptionsViewContainer>
    </SubscriptionsViewOuterContainer>
  );
};
