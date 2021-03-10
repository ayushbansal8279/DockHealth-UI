/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount, useToggle } from 'react-use';
import { setHeader } from 'actions/template-actions';
import {
  getBillingDetails,
  getBillingEstimate,
  selectUsersForPlan,
} from 'actions/organization-actions';
import { findAllUsers, loading } from 'actions/people-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import useBoolean from 'hooks/useBoolean';
import { subscriptionPlanData as subscriptionGlobalPlanData } from './SubscriptionsPlansView/SubscriptionsPlansView.PlanData';
import { USER_SUBSCRIPTION_STATUS } from './SubscriptionsView.MembersTable.SubscriptionSwitcher';
import { BILLING_FREQUENCY } from './helpers';

const initializeSubscriptionsViewHooks = () => {
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

  const outerContainerReference = useRef(null);

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
    loading()(dispatch);
    findAllUsers()(dispatch).then(() => {
      recalculateEstimate();
    });
  }, [dispatch, recalculateEstimate]);

  useMount(() => {
    selectUsersForPlan({ users: null })(dispatch);

    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Subscription & Users</GenericHeader>,
            alignItems: 'center',
          },
        ],
      }),
    );

    getBillingDetails({ organizationIdentifier })(dispatch);

    recalculateEstimate();

    getAllUsers();
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

  return {
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
  };
};

export default initializeSubscriptionsViewHooks;
