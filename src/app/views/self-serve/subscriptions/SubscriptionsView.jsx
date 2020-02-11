import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useToggle } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import {
  getBillingEstimate,
  selectUsersForPlan,
  setPaymentNewPlan,
  getBillingDetails,
} from '../../../actions/organization-actions';
import { findAllUsers, loading } from '../../../actions/people-actions';
import * as userApi from '../../../api/user-api';
import useBoolean from '../../../hooks/useBoolean';
import SubscriptionsPlansView from './subscriptions-plans/SubscriptionsPlansView';
import {
  subscriptionPlanData as subscriptionGlobalPlanData,
  SUBSCRIPTION_PLAN_KEYS,
} from './subscriptions-plans/SubscriptionsPlansView.PlanData';
import CurrentPlan from './SubscriptionsView.CurrentPlan';
import InvitationPanel from './SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from './SubscriptionsView.MembersTable';
import {
  BillingContainer,
  BillingLabel,
  BillingPrice,
  BottomButtonContainer,
  StyledButton,
  SubscriptionsViewContainer,
  Title,
} from './SubscriptionsView.Styled';
import {
  BILLING_FREQUENCY,
  getSubscriptionPlanData,
} from './SubscriptionsView.Utilities';
import { USER_SUBSCRIPTION_STATUS } from './SubscriptionsView.MembersTable.SubscriptionSwitcher';

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
  const [selectedUsers, setSelectedUsersRaw] = useState([]);
  const [
    subscriptionPlansVisible,
    showSubscriptionPlans,
    hideSubscriptionPlans,
  ] = useBoolean(false);

  const [chosenPlan, setChosenPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [annualPayment, toggleAnnualPayment] = useToggle(false);

  const setSelectedUsers = useCallback(
    users => {
      setSelectedUsersRaw(users);
      selectUsersForPlan({ users })(dispatch);
    },
    [dispatch],
  );

  const {
    billingData,
    organization,
    organizationIdentifier,
    isFetching: isOrganizationFetching,
    requestError: organizationRequestError,
    isFetchingBilling,
    requestErrorBilling,
  } = useSelector(store => ({
    ...store.organizationState,
    organizationIdentifier:
      store.userState?.userProfile?.organizationIdentifier,
  }));

  const recalculateEstimate = useCallback(
    (subscriptionPlan, billingFrequency) =>
      getBillingEstimate({ subscriptionPlan, billingFrequency })(dispatch),
    [dispatch],
  );

  const getAllUsers = useCallback(() => {
    userApi.isAuthenticated({
      isLoggedIn: loggedIn => {
        if (loggedIn) {
          loading()(dispatch);
          findAllUsers()(dispatch).then(() => {
            recalculateEstimate();
          });
        }
      },
    });
  }, [dispatch, recalculateEstimate]);

  useMount(() => {
    selectUsersForPlan({ users: null })(dispatch);

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

    getBillingDetails({ organizationIdentifier })(dispatch);

    recalculateEstimate();

    getAllUsers();
  });

  const subscriptionPlanData = getSubscriptionPlanData({
    organization,
    billingData,
    chosenPlan,
    annualPayment,
    selectedUsers,
  });

  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(
    USER_SUBSCRIPTION_STATUS.ALL,
  );

  useEffect(() => {
    if (organization) {
      const { subscriptionDetails } = organization;

      toggleAnnualPayment(
        subscriptionDetails.billingFrequency === BILLING_FREQUENCY.ANNUAL,
      );

      const newCurrentPlan =
        subscriptionGlobalPlanData.find(
          ({ subscriptionPlan }) =>
            subscriptionPlan === subscriptionDetails?.subscriptionPlan,
        ) ?? null;

      setCurrentPlan(newCurrentPlan);
      setChosenPlan(newCurrentPlan);
    }
  }, [organization, setChosenPlan, setCurrentPlan, toggleAnnualPayment]);

  const plansViewVisible =
    subscriptionPlansVisible || subscriptionPlanData.planIsTrial;

  const buyButtonDisabled =
    !chosenPlan || chosenPlan?.key === SUBSCRIPTION_PLAN_KEYS.ENTERPRISE;

  const billingFrequency = annualPayment
    ? BILLING_FREQUENCY.ANNUAL
    : BILLING_FREQUENCY.MONTHLY;

  return (
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
      />
      <InvitationPanel getAllUsers={getAllUsers} />
      {userSubscriptionStatus !== USER_SUBSCRIPTION_STATUS.UNSUBSCRIBED && (
        <BillingContainer>
          <BillingLabel>{subscriptionPlanData.planBillingPeriod}</BillingLabel>
          <BillingPrice>{subscriptionPlanData.planTotalPayment}</BillingPrice>
        </BillingContainer>
      )}
      <BottomButtonContainer container justify="flex-end">
        {plansViewVisible && (
          <>
            <StyledButton variant="outlined" onClick={hideSubscriptionPlans}>
              Cancel
            </StyledButton>
            <StyledButton
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
            </StyledButton>
          </>
        )}
      </BottomButtonContainer>
    </SubscriptionsViewContainer>
  );
};
