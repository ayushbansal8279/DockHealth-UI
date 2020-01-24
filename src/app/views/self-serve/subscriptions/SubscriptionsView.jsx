import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import useBoolean from '../../../hooks/useBoolean';
import SubscriptionsPlansView from './subscriptions-plans/SubscriptionsPlansView';
import CurrentPlan from './SubscriptionsView.CurrentPlan';
import InvitationPanel from './SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from './SubscriptionsView.MembersTable';
import {
  BillingContainer,
  BillingLabel,
  BillingPrice,
  SubscriptionsViewContainer,
  Title,
} from './SubscriptionsView.Styled';
import { getSubscriptionPlanData } from './SubscriptionsView.Utilities';

export default () => {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [
    subscriptionPlansVisible,
    showSubscriptionPlans,
    hideSubscriptionPlans,
  ] = useBoolean(false);

  const {
    organization,
    organizationId,
    isFetching: isOrganizationFetching,
    requestError: organizationRequestError,
  } = useSelector(store => ({
    ...store.organizationState,
    organizationId: store.userState?.userProfile?.organizationId,
  }));

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

  const subscriptionPlanData = getSubscriptionPlanData({
    organization,
    selectedUsers,
  });

  return (
    <SubscriptionsViewContainer container>
      {subscriptionPlansVisible || subscriptionPlanData.planIsTrial ? (
        <SubscriptionsPlansView
          hideSubscriptionPlans={hideSubscriptionPlans}
          organizationId={organizationId}
          isCancelVisible={!subscriptionPlanData.planIsTrial}
        />
      ) : (
        <CurrentPlan
          isOrganizationFetching={isOrganizationFetching}
          organizationRequestError={organizationRequestError}
          subscriptionPlanData={subscriptionPlanData}
          showSubscriptionPlans={showSubscriptionPlans}
        />
      )}
      <SubscriptionsViewMembersTable
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <InvitationPanel />
      <BillingContainer>
        <BillingLabel>{subscriptionPlanData.planBillingPeriod}</BillingLabel>
        <BillingPrice>{subscriptionPlanData.planTotalPayment}</BillingPrice>
      </BillingContainer>
    </SubscriptionsViewContainer>
  );
};
