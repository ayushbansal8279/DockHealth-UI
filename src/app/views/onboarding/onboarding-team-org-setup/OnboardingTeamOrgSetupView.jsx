import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';

import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import InvitationPanel from '../../self-serve/subscriptions/SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from '../../self-serve/subscriptions/SubscriptionsView.MembersTable';
import {
  OnboardingButton,
  OnboardingDivider,
  OnboardingH1,
  OnboardingH2,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';

const goToProfile = () => {
  hashHistory.push('/onboarding/profile');
};

const OnboardingTeamOrgSetupView = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 4 })(dispatch);
  });

  return (
    <div>
      <Grid container justify="space-between">
        <OnboardingH1>Invite your team</OnboardingH1>
      </Grid>
      <SubscriptionsViewMembersTable
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        showJoined={false}
        showSubscription={false}
        fetchAllUsers={false}
      />
      <InvitationPanel />
      <OnboardingSpacing2 />
      <OnboardingDivider />
      <OnboardingSpacing4 />
      <Grid container justify="flex-end">
        <OnboardingButton variant="contained" onClick={goToProfile}>
          <OnboardingH2>Invite team & Set Up Org</OnboardingH2>
        </OnboardingButton>
      </Grid>
    </div>
  );
};

export default OnboardingTeamOrgSetupView;
