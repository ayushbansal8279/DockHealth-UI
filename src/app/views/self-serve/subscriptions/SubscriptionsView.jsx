import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
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

export default () => {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  return (
    <SubscriptionsViewContainer container>
      <CurrentPlan />
      <SubscriptionsViewMembersTable
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <InvitationPanel />
      <BillingContainer>
        <BillingLabel>Billed monthly on first day of each month</BillingLabel>
        <BillingPrice>$0</BillingPrice>
      </BillingContainer>
      <BottomButtonContainer container justify="flex-end">
        <StyledButton type="button" variant="text">
          Cancel
        </StyledButton>
        <StyledButton type="submit" variant="contained">
          Buy this plan
        </StyledButton>
      </BottomButtonContainer>
    </SubscriptionsViewContainer>
  );
};
