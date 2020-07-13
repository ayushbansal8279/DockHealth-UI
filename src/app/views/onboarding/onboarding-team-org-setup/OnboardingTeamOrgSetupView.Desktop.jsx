import { Grid } from '@material-ui/core';
import React, { useCallback, useRef } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
// import { useMount, useToggle } from 'react-use';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { setOnboardingCurrentStep } from 'actions/onboarding-progress-actions';
import { updateOrganizationName } from 'actions/organization-actions';
import { findAllUsers, loading } from 'actions/people-actions';
import * as userApi from 'api/user-api';
import Spacing from 'components/common/Spacing';
import { UniversalMontserratInput } from 'components/userProfileView/UniversalInput';
// import InvitePeoplePopover from 'views/People/PeopleView.InvitePeoplePopover';
import { MontserratTypography } from 'styles/theme-montserrat';
import { OnboardingButton } from '../OnboardingTemplate.Components';

const goToMainPage = () => {
  hashHistory.push('/');
};

// const goToProfile = () => {
//   hashHistory.push('/onboarding/profile');
// };

const onSubmit = ({ dispatch }) => ({ organizationName }) => {
  updateOrganizationName({ organizationName })(dispatch).then(() => {
    // goToProfile();
    goToMainPage();
  });
};

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  organizationName: string().required(REQUIRED_MESSAGE),
});

// const InvitePeopleButton = ({ getAllUsers }) => {
//   const invitePeopleButtonReference = useRef(null);
//   const [isPopoverOpen, togglePopoverOpen] = useToggle(false);

//   const toggleInvitePopover = useCallback(
//     ({ newInvitePopoverState } = {}) => {
//       togglePopoverOpen(newInvitePopoverState ?? !isPopoverOpen);
//     },
//     [isPopoverOpen, togglePopoverOpen],
//   );

//   return (
//     <>
//       <OnboardingButton
//         variant="contained"
//         size="small"
//         onClick={() => togglePopoverOpen(true)}
//       >
//         <div ref={invitePeopleButtonReference}>
//           <MontserratTypography variant="h4" weight="500">
//             + Add more users to my organization
//           </MontserratTypography>
//         </div>
//       </OnboardingButton>
//       <InvitePeoplePopover
//         open={isPopoverOpen}
//         toggleInvitePopover={toggleInvitePopover}
//         anchor={invitePeopleButtonReference.current}
//         getAllUsers={getAllUsers}
//       />
//     </>
//   );
// };

const OnboardingTeamOrgSetupViewDesktop = () => {
  // const [selectedUsers, setSelectedUsers] = useState([]);
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
            userApi.getUserNotoficationPrefs();

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

  // const [invitationPanelVisible, toggleInvitationPanelVisible] = useState(
  //   false,
  // );

  return (
    <form
      onSubmit={formMethods.handleSubmit(onSubmit({ dispatch }))}
      ref={outerContainerReference}
    >
      <FormContext {...formMethods}>
        <Spacing vertical={6} />
        <MontserratTypography variant="h1" weight="600">
          TIME TO CHOOSE A NAME
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h3">
          What would you like to call your group or practice?
        </MontserratTypography>
        <MontserratTypography variant="h3">
          You&apos;re Welcome to be creative, or just use your
          organization&apos;s official name.
        </MontserratTypography>
        <Spacing vertical={5} />
        <UniversalMontserratInput
          autoFocus
          label="What is the name of your group or practice?"
          name="organizationName"
          required
        />

        {/* <Spacing vertical={6} />
        <Grid container justify="space-between">
          <MontserratTypography variant="h2" weight="600">
            Invite your team
          </MontserratTypography>
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
        </Grid> */}
        <Spacing vertical={4} />
        <Grid container justify="flex-end">
          <Spacing horizontal={4} />
          <OnboardingButton variant="contained" type="submit" size="small">
            Continue
          </OnboardingButton>
        </Grid>
      </FormContext>
    </form>
  );
};

export default OnboardingTeamOrgSetupViewDesktop;
