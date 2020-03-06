import Grid from '@material-ui/core/Grid';
import React, { useCallback, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useToggle } from 'react-use';
import { object, string } from 'yup';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import { updateOrganizationName } from '../../../actions/organization-actions';
import InvitePeoplePopover from '../../PeopleView.InvitePeoplePopover';
import InvitationPanel from '../../self-serve/subscriptions/SubscriptionsView.InvitationPanel';
import SubscriptionsViewMembersTable from '../../self-serve/subscriptions/SubscriptionsView.MembersTable';
import * as userApi from '../../../api/user-api';
import {
  OnboardingButton,
  OnboardingDivider,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingInput,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';
import { findAllUsers, loading } from '../../../actions/people-actions';

const goToProfile = () => {
  hashHistory.push('/onboarding/profile');
};

const onSubmit = ({ dispatch }) => ({ organizationName }) => {
  updateOrganizationName({ organizationName })(dispatch).then(() => {
    goToProfile();
  });
};

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  organizationName: string().required(REQUIRED_MESSAGE),
});

const InvitePeopleButton = ({ getAllUsers }) => {
  const invitePeopleButtonReference = useRef(null);
  const [isPopoverOpen, togglePopoverOpen] = useToggle(false);

  const toggleInvitePopover = useCallback(
    ({ newInvitePopoverState } = {}) => {
      togglePopoverOpen(newInvitePopoverState ?? !isPopoverOpen);
    },
    [isPopoverOpen, togglePopoverOpen],
  );

  return (
    <>
      <OnboardingButton
        variant="contained"
        size="small"
        onClick={() => togglePopoverOpen(true)}
      >
        <div ref={invitePeopleButtonReference}>
          <b>+ Add more users to my organization</b>
        </div>
      </OnboardingButton>
      <InvitePeoplePopover
        open={isPopoverOpen}
        toggleInvitePopover={toggleInvitePopover}
        anchor={invitePeopleButtonReference.current}
        getAllUsers={getAllUsers}
      />
    </>
  );
};

const OnboardingTeamOrgSetupViewDesktop = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const outerContainerReference = useRef(null);
  const dispatch = useDispatch();

  const getAllUsers = useCallback(() => {
    userApi.isAuthenticated({
      isLoggedIn: (loggedIn, user) => {
        if (loggedIn) {
          userApi.getUserByEmail(user.username, user).then(data => {
            if (data.profileThumbnailPictureHash) {
              userApi.getUserProfilePic(data.userIdentifier, 'PROFILE');
            }
            userApi.getAllSpecialties();
            userApi.getAllTitles();

            loading()(dispatch);
            findAllUsers()(dispatch);
          });
        }
      },
    });
  }, [dispatch]);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 4 })(dispatch);
    getAllUsers();
  });

  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });

  const [invitationPanelVisible, toggleInvitationPanelVisible] = useState(
    false,
  );

  return (
    <form
      onSubmit={formMethods.handleSubmit(onSubmit({ dispatch }))}
      ref={outerContainerReference}
    >
      <FormContext {...formMethods}>
        <OnboardingH2Bold>Organization</OnboardingH2Bold>
        <OnboardingSpacing2 />
        <OnboardingInput
          label="What's the name of your organization?"
          name="organizationName"
          placeholder="Enter signing organization name here"
          required
        />
        <OnboardingSpacing1 />
        <OnboardingH3>
          You’re welcome to provide an organizational name that is different
          from your formal legal name. This is what you would call your group or
          practice.
        </OnboardingH3>
        <OnboardingSpacing5 />
        <Grid container justify="space-between">
          <OnboardingH2Bold>Invite your team</OnboardingH2Bold>
          <InvitePeopleButton getAllUsers={getAllUsers} />
        </Grid>
        <SubscriptionsViewMembersTable
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          showJoined={false}
          showSubscription={false}
          showTableHeader={false}
          getAllUsers={getAllUsers}
          toggleInvitationPanelVisibility={toggleInvitationPanelVisible}
          HeaderAdornment={InvitePeopleButton}
        />
        <Grid container>
          {invitationPanelVisible && (
            <InvitationPanel getAllUsers={getAllUsers} />
          )}
        </Grid>
        <OnboardingSpacing2 />
        <OnboardingDivider />
        <OnboardingSpacing4 />
        <Grid container justify="flex-end">
          <OnboardingButton variant="contained" type="submit">
            <OnboardingH2Bold>Continue</OnboardingH2Bold>
          </OnboardingButton>
        </Grid>
      </FormContext>
    </form>
  );
};

export default OnboardingTeamOrgSetupViewDesktop;
