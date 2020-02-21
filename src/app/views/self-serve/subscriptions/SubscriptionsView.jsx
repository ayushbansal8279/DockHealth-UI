import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { setPaymentNewPlan } from '../../../actions/organization-actions';
import SubscriptionsPlansView from './subscriptions-plans/SubscriptionsPlansView';
import { SUBSCRIPTION_PLAN_KEYS } from './subscriptions-plans/SubscriptionsPlansView.PlanData';
import CurrentPlan from './SubscriptionsView.CurrentPlan';
import initializeSubscriptionsViewHooks from './SubscriptionsView.Hooks';
import InvitationPanel from './SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from './SubscriptionsView.MembersTable';
import { USER_SUBSCRIPTION_STATUS } from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import {
  BillingContainer,
  BillingLabel,
  BillingPrice,
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

  const buyButtonDisabled =
    !chosenPlan || chosenPlan?.key === SUBSCRIPTION_PLAN_KEYS.ENTERPRISE;

  const billingFrequency = annualPayment
    ? BILLING_FREQUENCY.ANNUAL
    : BILLING_FREQUENCY.MONTHLY;

  const billingVisible =
    userSubscriptionStatus !== USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED &&
    chosenPlan;

  const invitationPanelVisible =
    outerContainerReference.current?.clientHeight > window.innerHeight;

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
      <SubscriptionsViewContainer container>
        {plansViewVisible ? (
          <SubscriptionsPlansView
            organization={organization}
            chosenPlan={chosenPlan}
            setChosenPlan={setChosenPlan}
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
        />
        {invitationPanelVisible && (
          <InvitationPanel getAllUsers={getAllUsers} />
        )}
        {billingVisible && (
          <BillingContainer>
            <BillingLabel>
              {subscriptionPlanData.planBillingPeriod}
            </BillingLabel>
            <BillingPrice>{subscriptionPlanData.planTotalPayment}</BillingPrice>
          </BillingContainer>
        )}
        <BottomButtonContainer container justify="flex-end">
          {plansViewVisible && chosenPlan && (
            <>
              {!subscriptionPlanData?.planIsTrial && (
                <Button variant="text" onClick={hideSubscriptionPlans}>
                  Cancel
                </Button>
              )}
              <Button
                disabled={buyButtonDisabled}
                variant="contained"
                onClick={onSubscriptionPlanChosen({
                  annualPayment,
                  billingFrequency,
                  chosenPlan,
                  organizationIdentifier,
                  dispatch,
                })}
              >
                Buy this plan
              </Button>
            </>
          )}
        </BottomButtonContainer>
      </SubscriptionsViewContainer>
    </SubscriptionsViewOuterContainer>
  );
};
